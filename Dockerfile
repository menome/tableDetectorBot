FROM tensorflow/tensorflow:1.13.2-gpu-py3

EXPOSE 80
ENV PORT 80
RUN apt-get update && \ 
  apt-get install -y libsm6 libxext6 libxrender-dev nodejs npm git

# Commands will run in this directory
RUN mkdir /srv/app
RUN mkdir /srv/output
WORKDIR /srv/app

# # Install some Python stuffs.
# RUN apt-get update && \
#   apt-get install -y python python-dev python-pip python-virtualenv nodejs npm && \
#   rm -rf /var/lib/apt/lists/*

# Add build file
COPY ./package.json package.json

# Install dependencies and generate production dist
ARG NPM_TOKEN
COPY .npmrc-deploy .npmrc
RUN npm install
RUN rm -f .npmrc

# RUN pip --version
RUN pip install opencv-python pytesseract
RUN git clone https://github.com/interviewBubble/Tabulo.git
RUN pip install -e Tabulo
RUN pip install --upgrade tensorflow==1.12.0

# Copy the code for the prod container.
# This seems to not cause any problems in dev when we mount a volume at this point.
COPY ./app app
COPY ./config config

CMD npm start
