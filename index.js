const TextSimilarityTool = require('text-similarity-tool');
const fetch = require('node-fetch'); 

class ProjectDependencyAnalyzer {
  constructor(apiUrl) {
    this.apiUrl = apiUrl;
    this.similarityTool = new TextSimilarityTool();
  }

  async fetchProjectData(projectName) {
    const response = await fetch(`${this.apiUrl}/projects/${projectName}/dependencies`);
    if (!response.ok) {
      throw new Error('Failed to fetch project data');
    }
    return response.json();
  }

  async calculateDependencyImpact(projectName) {
    try {
      const projectData = await this.fetchProjectData(projectName);
      const { dependencies } = projectData;

      if (!dependencies || dependencies.length === 0) {
        throw new Error('No dependencies found for this project.');
      }

      let impactScore = 0;
      for (const dependency of dependencies) {
        const dependencyData = await this.fetchProjectData(dependency);
        impactScore += dependencyData.dependents.length; 
      }

      return impactScore;
    } catch (error) {
      console.error('Error calculating dependency impact:', error);
      throw error;
    }
  }
}

module.exports = ProjectDependencyAnalyzer;