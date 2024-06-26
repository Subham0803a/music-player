from django.http import JsonResponse, HttpResponseBadRequest
from django.views.decorators.csrf import csrf_exempt
from gridfs import GridFS
from pymongo import MongoClient
from bson import ObjectId


# Connect to MongoDB [Replace with your details]
client = MongoClient('mongodb://localhost:27017/')
db = client['Musics']
fs = GridFS(db)



@csrf_exempt
def upload_music(request):
    if request.method == 'POST':
        file=request.FILES['file']
        fs.put(file,filename=file.name)
        return JsonResponse({"success":True})


@csrf_exempt
def get_all_songs(request):
    if request.method!= 'GET':
        return HttpResponseBadRequest('Method Not Allowed')

    try:
        songs = []
        for song in fs.find():
            song_data = db.media.find_one({'_id': song._id})  # Retrieve metadata by ID
            if song_data:
                songs.append({
                    'id': song._id,
                    'filename': song_data['filename'],
                    # Add other metadata fields retrieved from 'media' as needed
                })
        return JsonResponse({'songs': songs}, safe=False)
    except Exception as e:
        print(f'Error getting all songs: {e}')
        return JsonResponse({'error': 'Error retrieving songs'}, status=500)


@csrf_exempt
def get_song_by_id(request, song_id):
    if request.method != 'GET':
        return HttpResponseBadRequest('Method Not Allowed')

    try:
        song_id = ObjectId(song_id)  # Ensure valid ObjectId format

        song_data = fs.get(song_id)
        if song_data:
            metadata = db.media.find_one({'_id': song_id})  # Retrieve metadata by ID
            if metadata:
                return JsonResponse({
                    'data': song_data.read(),
                    'filename': metadata['filename'],
                })
            else:
                return JsonResponse({'error': f'Song metadata not found for ID {song_id}'}, status=404)
        else:
            return JsonResponse({'error': f'Song with ID {song_id} not found'}, status=404)
    except Exception as e:
        print(f'Error getting song: {e}')
        return JsonResponse({'error': 'Error retrieving song'}, status=500)
