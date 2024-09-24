# LiberLens 📚🔍

LiberLens is an interactive book exploration tool that allows users to upload books and engage in conversations with them using a RAG based LLM app.
## Demo Video


https://github.com/HimanshuMohanty-Git24/LiberLens/assets/94133298/89c7e540-5a36-445e-97ad-8b7fbfcec63a


## Folder Structure 📁

```
.
└── booknotes/
    ├── backend/
    │   ├── uploads/
    │   ├── app.py
    │   └── requirements.txt
    └── frontend/
        ├── public/
        ├── src/
        │   ├── app.js
        │   ├── index.css
        │   ├── index.js
        │   └── reportWebVitals.js
        ├── package.json
        └── package-lock.json
```

## Motivation 💡

As an avid reader, I've always dreamed of a way to directly interact with the books I love. LiberLens was born from this passion - a desire to dive deeper into texts, to question, explore, and uncover insights that might not be immediately apparent. This project represents my vision of bringing books to life, allowing readers to engage in a dialogue with the wealth of knowledge contained within their pages.

## Tech Stack 🛠️

### Backend
- Python 3.9
- Flask
- TensorFlow
- Groq
- PyPDF2
- NumPy
- scikit-learn

### Frontend
- React
- Material-UI (MUI)
- Axios

## Setup Instructions 🚀

### Backend Setup

1. Navigate to the backend directory:
   ```
   cd booknotes/backend
   ```

2. Create a virtual environment:
   ```
   python -m venv venv
   ```

3. Activate the virtual environment:
   - On Windows:
     ```
     venv\Scripts\activate
     ```
   - On macOS and Linux:
     ```
     source venv/bin/activate
     ```

4. Install the required packages:
   ```
   pip install -r requirements.txt
   ```

5. Create a `.env` file in the backend directory and add your Groq API key:
   ```
   GROQ_API_KEY=your_groq_api_key_here
   ```

6. Run the Flask application:
   ```
   python app.py
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd booknotes/frontend
   ```

2. Install the required npm packages:
   ```
   npm install
   ```

3. Create a `.env` file in the frontend directory and add the backend URL:
   ```
   REACT_APP_API_URL=http://localhost:5000
   ```

4. Start the React development server:
   ```
   npm start
   ```

## Usage 🖥️

1. Open your browser and go to `http://localhost:3000`
2. Upload a PDF book using the "Choose Book" button
3. Once uploaded, enter questions about the book in the text field
4. Click "Ask" to get AI-generated responses based on the book's content

## Contributing 🤝

Contributions, issues, and feature requests are welcome! Feel free to check [issues page](https://github.com/HimanshuMohanty-Git24/LiberLens/issues) if you want to contribute.

## License 📄

This project is [MIT](https://choosealicense.com/licenses/mit/) licensed.

## Contact 📬

Himanshu Mohanty - [GitHub](https://github.com/HimanshuMohanty-Git24)

Project Link: [https://github.com/HimanshuMohanty-Git24/LiberLens](https://github.com/HimanshuMohanty-Git24/LiberLens)

---

Happy reading and exploring with LiberLens! 📖✨
