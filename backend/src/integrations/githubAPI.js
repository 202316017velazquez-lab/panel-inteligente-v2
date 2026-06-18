import axios from 'axios';
import config from '../config/env.js';

class GitHubAPI {
    constructor() {
        this.baseUrl = config.github.baseUrl;
    }

    async getRepoInfo(owner, repo) {
        try {
            const response = await axios.get(`${this.baseUrl}/repos/${owner}/${repo}`);

            return {
                success: true,
                data: {
                    name: response.data.name,
                    full_name: response.data.full_name,
                    description: response.data.description || 'Sin descripción',
                    stars: response.data.stargazers_count,
                    forks: response.data.forks_count,
                    open_issues: response.data.open_issues_count,
                    language: response.data.language || 'No especificado',
                    html_url: response.data.html_url,
                    created_at: response.data.created_at,
                    updated_at: response.data.updated_at,
                    owner: response.data.owner.login
                },
                api: 'GitHub'
            };
        } catch (error) {
            console.error('Error en GitHub API repo:', error.response?.data || error.message);
            
            if (error.response?.status === 404) {
                throw new Error(`Repositorio "${owner}/${repo}" no encontrado`);
            } else if (error.response?.status === 403) {
                throw new Error('Límite de GitHub API excedido');
            } else {
                throw new Error('Error al consultar repositorio');
            }
        }
    }
}

export default new GitHubAPI();