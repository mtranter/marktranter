import {inject} from 'aurelia-framework'
import {CvRepository} from './../repository.js'

@inject(CvRepository)
export class Skills{
    skills = [];
    newSkill = {};
    constructor(repo){
        this.repo = repo
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
    }
}