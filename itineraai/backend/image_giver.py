import requests
import streamlit as st


ACCESS_KEY = "JEDUQncAp_Au6b3mtbemFTYNwp1llCfl_J85BQc9h2Y"


url = "https://api.unsplash.com/photos"
headers = {"Authorization": f"Client-ID {ACCESS_KEY}"}

response = requests.get(url, headers=headers)

if response.status_code == 200:
    images = response.json()

    st.title("📸 Unsplash Gallery")

    for img in images:
        st.image(img["urls"]["small"], caption=img["user"]["name"])

else:
    st.error("Failed to fetch images")