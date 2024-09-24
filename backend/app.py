from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import urllib.request
import re
import numpy as np
import tensorflow_hub as hub
from sklearn.neighbors import NearestNeighbors
from groq import Groq
from dotenv import load_dotenv
from PyPDF2 import PdfReader

load_dotenv()

app = Flask(__name__)
CORS(app)

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
client = Groq(api_key=GROQ_API_KEY)

class SemanticSearch:
    def __init__(self):
        self.use = hub.load('https://tfhub.dev/google/universal-sentence-encoder/4')
        self.fitted = False

    def fit(self, data, batch=1000, n_neighbors=5):
        self.data = data
        self.embeddings = self.get_text_embedding(data, batch=batch)
        n_neighbors = min(n_neighbors, len(self.embeddings))
        self.nn = NearestNeighbors(n_neighbors=n_neighbors)
        self.nn.fit(self.embeddings)
        self.fitted = True

    def __call__(self, text, return_data=True):
        inp_emb = self.use([text])
        neighbors = self.nn.kneighbors(inp_emb, return_distance=False)[0]
        if return_data:
            return [self.data[i] for i in neighbors]
        else:
            return neighbors

    def get_text_embedding(self, texts, batch=1000):
        embeddings = []
        for i in range(0, len(texts), batch):
            text_batch = texts[i:(i+batch)]
            emb_batch = self.use(text_batch)
            embeddings.append(emb_batch)
        return np.vstack(embeddings)

recommender = SemanticSearch()

def download_pdf(url, output_path):
    urllib.request.urlretrieve(url, output_path)

def preprocess(text):
    text = text.replace('\n', ' ')
    return re.sub(r'\s+', ' ', text)

def pdf_to_text(path, start_page=1, end_page=None):
    with open(path, 'rb') as file:
        reader = PdfReader(file)
        total_pages = len(reader.pages)

        if end_page is None:
            end_page = total_pages

        text_list = []
        for i in range(start_page-1, min(end_page, total_pages)):
            page = reader.pages[i]
            text = page.extract_text()
            text = preprocess(text)
            text_list.append(text)

    return text_list

def text_to_chunks(texts, word_length=150, start_page=1):
    text_toks = [t.split(' ') for t in texts]
    chunks = []
    for idx, words in enumerate(text_toks):
        for i in range(0, len(words), word_length):
            chunk = words[i:i+word_length]
            if (i+word_length) > len(words) and (len(chunk) < word_length) and (
                len(text_toks) != (idx+1)):
                text_toks[idx+1] = chunk + text_toks[idx+1]
                continue
            chunk = ' '.join(chunk).strip()
            chunk = f'[{idx+start_page}] "{chunk}"'
            chunks.append(chunk)
    return chunks

def load_recommender(path, start_page=1):
    texts = pdf_to_text(path, start_page=start_page)
    chunks = text_to_chunks(texts, start_page=start_page)
    recommender.fit(chunks)
    return 'Corpus Loaded.'

def generate_text(prompt, model="llama3-8b-8192"):
    chat_completion = client.chat.completions.create(
        messages=[
            {
                "role": "user",
                "content": prompt,
            }
        ],
        model=model,
    )
    return chat_completion.choices[0].message.content

def generate_answer(question):
    topn_chunks = recommender(question)
    prompt = "search results:\n\n"
    prompt += "\n\n".join(topn_chunks)
    prompt += "\n\nInstructions: Using the search results above, write a detailed and well-referenced answer to the query. "\
              "Make sure to cite each reference with [number] at the end of each sentence. "\
              "Separate answers for different subjects if needed. Use only the information from the results and do not add any additional information. "\
              "The answer should be correct, concise, and relevant. If the search results do not relate to the query, simply state 'Found Nothing'. "\
              "Ignore irrelevant results.\n\n"
    prompt += f"Query: {question}\nAnswer:"
    return generate_text(prompt)

@app.route('/upload', methods=['POST'])
def upload():
    if 'file' not in request.files:
        return jsonify({"message": "No file part in the request", "status": "error"}), 400
    
    file = request.files['file']
    
    if file.filename == '':
        return jsonify({"message": "No file selected", "status": "error"}), 400
    
    if file:
        os.makedirs("uploads", exist_ok=True)
        file_path = os.path.join("uploads", file.filename)
        file.save(file_path)
        load_recommender(file_path)
        return jsonify({"message": "File uploaded and processed successfully.", "status": "ready"}), 200
    
    return jsonify({"message": "File upload failed", "status": "error"}), 400

@app.route('/ask', methods=['POST'])
def ask():
    data = request.get_json()
    question = data.get("question")
    if not question:
        return jsonify({"message": "Question field is empty"}), 400
    answer = generate_answer(question)
    return jsonify({"answer": answer}), 200

# @app.route('/' , methods=['GET'])
# def hello():
#     return "Hello, Flask!"

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000)

if __name__ == '__main__':
    app.run(debug=True)