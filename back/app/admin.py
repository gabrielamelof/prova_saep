from django.contrib import admin

# Register your models here.
from django.contrib import admin
from .models import Usuario, Produto, Movimentacao
from django.contrib.auth.admin import UserAdmin


# ================================
# ADMIN DO USUÁRIO CUSTOMIZADO
# ================================
class UsuarioAdmin(UserAdmin):
    model = Usuario
    list_display = ("login", "nome", "is_staff", "is_active")
    list_filter = ("is_staff", "is_active")
    fieldsets = (
        (None, {"fields": ("login", "password")}),
        ("Informações pessoais", {"fields": ("nome",)}),
        ("Permissões", {"fields": ("is_staff", "is_superuser", "is_active", "groups", "user_permissions")}),
    )
    add_fieldsets = (
        (None, {
            "classes": ("wide",),
            "fields": ("login", "nome", "password1", "password2", "is_staff", "is_superuser"),
        }),
    )
    search_fields = ("login", "nome")
    ordering = ("login",)


admin.site.register(Usuario, UsuarioAdmin)


# ================================
# ADMIN DO PRODUTO
# ================================
@admin.register(Produto)
class ProdutoAdmin(admin.ModelAdmin):
    list_display = ("id_produto", "nome", "estoque_atual", "estoque_minimo")
    search_fields = ("nome",)


# ================================
# ADMIN DA MOVIMENTAÇÃO
# ================================
@admin.register(Movimentacao)
class MovimentacaoAdmin(admin.ModelAdmin):
    list_display = ("id_movimentacao", "produto", "usuario", "tipo", "quantidade", "data_mov")
    list_filter = ("tipo", "data_mov")
    search_fields = ("produto__nome", "usuario__login")
