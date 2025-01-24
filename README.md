## Introduction

This app, developed with electron.js, allows to quickly access any repository of Word documents. It provides an interface where the user can see the table of contents of each document. Each section can be clicked on, which opens the document directly in that location.

This app was initially intended for managing the information contained in Mosh Hamedani's courses (https://codewithmosh.com). The documents' content has been removed before uploading the repository to github, with only the sections and lessons names remaining, which are in the public domain.

## Setup

First, from the terminal, you need to install all the node dependencies:

    npm i

Then, create an .env file in the root of the project, and set the DOCUMENTS_FOLDER environment variable to the following value:

    DOCUMENTS_FOLDER=documents_no-content

Finally, run the project:

    npm start

## Note of clarification

This app uses (Windows) Powershell to open and manage Word.Application instances. Therefore, having Microsoft Office installed in your machine is also required.
