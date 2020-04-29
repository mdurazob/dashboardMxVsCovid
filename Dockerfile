FROM python:latest

RUN mkdir /app
WORKDIR /app
COPY requirements.txt ./
ENV PATH="/root/.local/bin:${PATH}"
RUN pip install --user -r requirements.txt

COPY app.py .
COPY input input
COPY static static
COPY templates templates

RUN ls -lrth /app
RUN ls -lrth /app/input

CMD ["python", "app.py"]