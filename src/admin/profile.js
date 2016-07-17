import {inject} from 'aurelia-framework'
import {CvRepository} from './../repository.js'

@inject(CvRepository)
export class Profile{
    profile = {name:"Mark", blurb: "A good cunt.", title:"A developer innit."}
    constructor(repo){
        this.repo = repo
    }
    save(profile) {
        this.repo.saveProfile(profile);
    }

    async activate(){
        this.profile = await this.repo.getProfile();
    }
}