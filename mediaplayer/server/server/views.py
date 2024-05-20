from django.http import HttpResponse
from django.shortcuts import render

def index(request):
    return HttpResponse("<h1>WELCOME TO MUSIC-PLAYER SERVER</h1>")
