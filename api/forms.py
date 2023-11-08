from django import forms
from fileuploadtron_app.models import CustomUser


class RegistrationForm(forms.ModelForm):
    password = forms.CharField(widget=forms.PasswordInput)

    class Meta:
        model = CustomUser
        fields = ['username', 'email', 'password']


class LoginForm(forms.Form):
    # email = forms.EmailField()
    username = forms.CharField(max_length=30)
    password = forms.CharField(widget=forms.PasswordInput)

    class Meta:
        model = CustomUser