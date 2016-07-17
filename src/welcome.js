import {CvRepository} from './repository.js';
import {inject} from 'aurelia-framework';


@inject(CvRepository)
export class Welcome {
  skills = [];
  constructor(repo){
    this.repo=repo;
  }

  async activate() {
    this.profile = await this.repo.getProfile();
    this.skills = await this.repo.getSkills();
  }

}
