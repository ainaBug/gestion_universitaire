# dashboard/urls.py
from django.urls import path
from django.contrib.auth import views as auth_views
from . import views

urlpatterns = [
    path('login/', views.login_view, name='login'),
    path('dashboard/', views.dashboard_view, name='dashboard'),
    path('logout/', auth_views.LogoutView.as_view(next_page='login'), name='logout'),
    path('liste-etudiants/', views.liste_etudiants_view, name='liste_etudiants'),
    path('ajouter/', views.ajouter_etudiant, name='ajouter_etudiant'),
	path('etudiants/ajouter/', views.ajouter_etudiant, name='ajouter_etudiant'),
    path('api/etudiants/', views.api_liste_etudiants, name='api_liste_etudiants'),
]
