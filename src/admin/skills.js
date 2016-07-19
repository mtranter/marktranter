import {inject} from 'aurelia-framework'
import {CvRepository} from './../repository.js'
import faExplorer from './fa-explorer.js'

@inject(CvRepository, faExplorer)
export class Skills{
    skills = [];
    currentIcon = "fa-search";
    newSkill = {};
    constructor(repo, faExplorer){
        this.repo = repo
        this.faExplorer = faExplorer;
    }
    async addSkill(skill) {
        await this.repo.addSkill(skill);
        await this.activate()
    }
    cancel(){
        newSkill = {};
    }
    async activate(){
        this.skills = await this.repo.getSkills();
        this.iconClasses = this.faExplorer.getFaClasses();
    }
}