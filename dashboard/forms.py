# dashboard/forms.py
from django import forms
from .models import Etudiant


class LoginForm(forms.Form):
    username = forms.CharField(max_length=100)
    password = forms.CharField(widget=forms.PasswordInput())

class EtudiantForm(forms.ModelForm):
    class Meta:
        model = Etudiant
        fields = '__all__'
    
