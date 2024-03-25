const deleteUser = async (email) => {
    try {
        const response = await fetch(`/users/delete/${email}`, {
            method: 'DELETE',
        });
        if (response.ok) {
            console.log('Usuário excluído com sucesso.');
            window.location.reload();
        } else {
            console.error('Falha ao excluir usuário:', response.statusText);
        }
    } catch (error) {
        console.error('Erro ao excluir usuário:', error);
    }
};
