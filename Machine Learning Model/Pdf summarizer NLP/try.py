import re
from io import StringIO
from pdfminer.pdfinterp import PDFResourceManager, PDFPageInterpreter
from pdfminer.converter import TextConverter
from pdfminer.layout import LAParams
from pdfminer.pdfpage import PDFPage
import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.decomposition import LatentDirichletAllocation
from sklearn.feature_extraction.text import ENGLISH_STOP_WORDS
from wordcloud import WordCloud, STOPWORDS
from os import path
from PIL import Image
import matplotlib.pyplot as plt
import pyLDAvis.lda_model
import firebase_admin
from firebase_admin import credentials
from firebase_admin import storage
from firebase_admin import storage
from google.cloud import storage
from firebase_admin import db
import time

cred = credentials.Certificate("Machine Learning Model\Pdf summarizer NLP\legaldoco-firebase-adminsdk-c4a34-21af54984b.json")
firebase_admin.initialize_app(cred, {
    'storageBucket': 'gs://legaldoco.appspot.com',
    'databaseURL': 'https://legaldoco-default-rtdb.firebaseio.com'
})

root_ref = db.reference()

while True:
    def download_most_recent_pdf():
        # Replace with your Firebase Storage bucket name
        bucket_name = 'legaldoco.appspot.com'

        # Initialize the Google Cloud Storage client
        storage_client = storage.Client(project='legaldoco')
        bucket = storage_client.bucket(bucket_name)

        # List objects in the bucket
        all_objects = list(bucket.list_blobs())

        # Sort objects by last modification time (most recent first)
        all_objects.sort(key=lambda x: x.updated, reverse=True)

        # Get the most recent object (PDF)
        most_recent_pdf = all_objects[0]

        # Download the most recent PDF
        pdf_file = "downloaded_pdf.pdf"
        most_recent_pdf.download_to_filename(pdf_file)

        return pdf_file

    pdf_file = download_most_recent_pdf()

    def convert_pdf_to_text(path):
        rsrcmgr = PDFResourceManager()
        retstr = StringIO()
        laparams = LAParams()
        device = TextConverter(rsrcmgr, retstr, laparams=laparams)
        with open(path, 'rb') as fp:
            interpreter = PDFPageInterpreter(rsrcmgr, device)
            password = ""
            maxpages = 0
            caching = True
            pagenos = set()

            for page in PDFPage.get_pages(fp, pagenos, maxpages=maxpages, password=password, caching=caching,
                                          check_extractable=True):
                interpreter.process_page(page)

            text = retstr.getvalue()

        return text

    # Data Collection
    pdf_text = convert_pdf_to_text(pdf_file)

    # Data Preparation
    with open('xxx.txt', 'w', encoding="utf-8") as f:
        f.write(pdf_text)

    with open('xxx.txt', 'r', encoding="utf-8") as f:
        clean_cont = f.read().splitlines()

    shear = [i.replace('\xe2\x80\x9c', '') for i in clean_cont]
    shear = [i.replace('\xe2\x80\x9d', '') for i in shear]
    shear = [i.replace("\xe2\x80\x99s", "'s") for i in shear]
    shears = [x for x in shear if x != ' ']
    shearss = [x for x in shears if x != '']
    dubby = [re.sub("[^a-zA-Z]+", " ", s) for s in shearss]

    # Topic Modeling
    vect = CountVectorizer(ngram_range=(1, 1), stop_words=list(ENGLISH_STOP_WORDS))
    dtm = vect.fit_transform(dubby)

    lda = LatentDirichletAllocation(n_components=5)
    lda_dtf = lda.fit_transform(dtm)
    feature_names = np.array(vect.get_feature_names_out())
    sorting = np.argsort(lda.components_)[:, ::-1]

    def upload_text_to_realtime_database():
        # Get the first two sentences from the Agreement_Topic
        first_two_sentences_list = []
        Agreement_Topic = np.argsort(lda_dtf[:, 2])[::-1]
        for i in Agreement_Topic[:4]:
            first_two_sentences = ".".join(dubby[i].split(".")[:2]) + ".\n"
            first_two_sentences_list.append(first_two_sentences)

        # Combine the first two sentences into a single string
        summary_text = "\n".join(first_two_sentences_list)

        # Set the data in the Realtime Database
        root_ref.child('summary').set({'text': summary_text})  # Replace with your desired node name
        print('Data added to Realtime Database')

    # Call the function to upload the text to the Realtime Database
    upload_text_to_realtime_database()

    time.sleep(3600)  # Sleep for an hour before checking again
