from rest_framework import serializers
from .models import Usuario, Produto, Movimentacao


class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = ["id_usuario", "nome", "login", "password"]
        extra_kwargs = {
            "password": {"write_only": True}
        }

    def create(self, validated_data):
        return Usuario.objects.create_user(
            login=validated_data["login"],
            password=validated_data["password"],
            nome=validated_data["nome"],
        )


class ProdutoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Produto
        fields = "__all__"


class MovimentacaoSerializer(serializers.ModelSerializer):
    usuario_nome = serializers.ReadOnlyField(source="usuario.nome")
    produto_nome = serializers.ReadOnlyField(source="produto.nome")
    usuario = serializers.HiddenField(default=serializers.CurrentUserDefault())

    class Meta:
        model = Movimentacao
        fields = [
            "id_movimentacao",
            "produto",
            "produto_nome",
            "usuario",
            "usuario_nome",
            "tipo",
            "quantidade",
            "data_mov",
        ]