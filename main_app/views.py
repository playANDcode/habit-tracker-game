from django.shortcuts import render
from django.contrib.auth import authenticate, login, logout
from django.http import HttpResponse
from .models import User
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.urls import reverse

# Create your views here.
def index(request):
    # Display a splash page if the user is not logged in:
    if request.user.is_anonymous:
        return render(request, "main_app/splash.html")
    # Display the task manager app if the user is logged in:
    else:
        return render(request, "main_app/index.html")

def login_view(request):
    if request.method == "GET":
        return render(request, "main_app/login.html")
    else:
        # POST method
        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username,
            password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "main_app/login.html", {
                "message": "Invalid username and/or password."
            })

def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))
 
def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        nickname = request.POST["nickname"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "main_app/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username=username,
                password=password, nickname=nickname)
            user.save()
        except IntegrityError:
            return render(request, "main_app/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "main_app/register.html")


