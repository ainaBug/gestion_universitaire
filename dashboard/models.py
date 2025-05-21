# etudiants/models.py
from django.db import models

class Etudiant(models.Model):
    prenom = models.CharField(max_length=100)
    nom = models.CharField(max_length=100)
    date_naissance = models.DateField()
    lieu_naissance = models.CharField(max_length=100, blank=True, null=True)
    email = models.EmailField(unique=True)
    telephone = models.CharField(max_length=20, blank=True, null=True)
    adresse = models.CharField(max_length=255)
    ville = models.CharField(max_length=100)
    code_postal = models.CharField(max_length=10)
    province = models.CharField(max_length=100)
    niveau_etude = models.CharField(max_length=50)
    programme = models.CharField(max_length=100)
    classe = models.CharField(max_length=50)
    annee_scolaire = models.CharField(max_length=20)
    statut = models.CharField(max_length=20)
    notes = models.TextField(blank=True, null=True)
    photo = models.ImageField(upload_to='photos/', blank=True, null=True)
    numero_etudiant = models.CharField(max_length=20, blank=True, null=True, unique=True)
    date_ajout = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.prenom} {self.nom}"
