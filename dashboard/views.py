# dashboard/views.py
from dashboard.models import Etudiant
from .forms import LoginForm
from .forms import EtudiantForm
from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login
from django.contrib.auth.decorators import login_required
from django.contrib.auth import logout
from django.views.decorators.csrf import csrf_protect
from django.views.decorators.http import require_POST
from django.http import JsonResponse

#Login
def login_view(request):
    if request.method == 'POST':
        form = LoginForm(request.POST)
        if form.is_valid():
            username = form.cleaned_data['username']
            password = form.cleaned_data['password']
            user = authenticate(request, username=username, password=password)
            if user is not None:
                login(request, user)
                return redirect('dashboard')  
            else:
                form.add_error(None, "Nom d'utilisateur ou mot de passe invalide.")
    else:
        form = LoginForm()

    return render(request, 'admin/login.html', {'form': form})

@login_required(login_url='login')
def dashboard_view(request):
    print(">>> UTILISATEUR :", request.user)
    return render(request, 'admin/index.html')

def logout_view(request):
    logout(request)
    return redirect('login')

@login_required(login_url='login')
def liste_etudiants_view(request):
    etudiants = Etudiant.objects.all()
    return render(request, 'admin/liste_etudiants.html', {'etudiants': etudiants})

#Etudians
@require_POST  # Assure que cette vue ne traite que les POST
@csrf_protect  # Protège contre les attaques CSRF
def ajouter_etudiant(request):
    form = EtudiantForm(request.POST, request.FILES)
    if form.is_valid():
        etudiant = form.save(commit=False)
        if not etudiant.numero_etudiant:
            etudiant.numero_etudiant = f"ETU{Etudiant.objects.count() + 1:04}"
        etudiant.save()
        return JsonResponse({
            'success': True,
            'message': 'Étudiant ajouté avec succès',
            'etudiant': {
                'numero': etudiant.numero_etudiant,
                'nom': etudiant.nom,
                'prenom': etudiant.prenom,
                'programme': etudiant.programme,
            }
        })
    else:
        return JsonResponse({'success': False, 'errors': form.errors}, status=400)

# Vue pour afficher la liste des étudiants (GET)
def liste_etudiants_view(request):
    etudiants = Etudiant.objects.all()
    return render(request, 'admin/liste_etudiants.html', {'etudiants': etudiants})

def api_liste_etudiants(request):
    # Retourne les étudiants en format JSON
    etudiants = list(Etudiant.objects.values())
    return JsonResponse(etudiants, safe=False)