# p-ackUp


## To run backend: 

1. Create a virtual environment and install requirements

```
cd backend
python3 -m venv venv # only need to run once

source venv/bin/activate # on MacOS
venv\Scripts\activate # on Windows

pip install -r requirements.txt # run every time new dependencies are added
```

2. Start server

```
python3 server.py
```

Backend should be running on http://localhost:5000/ 

## To run frontend

In another terminal, run

```
cd frontend
npm install
npm start
```

View the website on http://localhost:3000/ 

## Adding .env file

Right-click the backend folder and create a new file called '.env'

Add the following and replace YOUR_KEY with your API key: GEMINI_API_KEY = YOUR_KEY 