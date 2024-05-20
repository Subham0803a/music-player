from django.urls import path
from.views import upload_music, get_all_songs, get_song_by_id

urlpatterns = [
    path('upload/', upload_music, name='upload_music'),
    path('get_songs/', get_all_songs, name='get_all_songs'),
    path('all_songs/<str:filename>', get_song_by_id, name='get_song_by_id'),   
]
