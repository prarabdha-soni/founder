from celery import Celery

celery_app = Celery("stree", broker="redis://localhost:6379/0") 