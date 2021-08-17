from django.shortcuts import render
from django.http import HttpResponse

# Create your views here.
def index(request):
    if request.user.is_anonymous:
        return render(request, "main_app/splash.html")
    else:
        return render(request, "main_app/index.html")

