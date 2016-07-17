import {inject} from 'aurelia-framework';
import {DynamoDb} from './aws.js'
import config from './appConfig.js'

@inject(DynamoDb)
class Repository {
    constructor(dynamoDb){
        this.dynamoDb = dynamoDb;
    }
    saveItem(item, tableName){
        var params = {
            TableName: tableName,
            Item: this._serialize(item)
        };
        return new Promise((resolve, reject) =>{
            this.dynamoDb.putItem(params, (err, succ) => {
                if(err) {
                    reject(err)
                }else{
                    resolve(succ)
                }
            });
        })
    }
    getItem(prop, val, tableName){
        var params = {
            TableName: tableName,
            Key:{
                [prop]: this._serializeProperty(val)
            }
        };
        return new Promise((resolve, reject) =>{
            this.dynamoDb.getItem(params, (err, succ) => {
                if(err) {
                    reject(err)
                }else{
                    resolve(this._deserialize(succ.Item))
                }
            });
        })
    }
    getAllItems(tableName){
        var params = {TableName: tableName};
        return new Promise((resolve, reject) =>{
            this.dynamoDb.scan(params, (err, succ) => {
                if(err) {
                    reject(err)
                }else{
                    resolve(succ.Items.map(i => this._deserialize(i)));
                }
            });
        });
    }
    _deserialize(item){
        var itemToReturn = {};
        for(var p in item){
            itemToReturn[p] = this._deserializeProperty(item[p]);
        }
        return itemToReturn;
    }
    _deserializeProperty(item){
        const key = Object.keys(item)[0];
        const val = item[key]; 
        switch(key){
            case "S": return val;
            case "N": return parseFloat(val);
            case "B": return val;
            case "L": return val.map(this._deserialize);
            case "M": return this._deserialize(val);
        }

    }
    _serialize(item){
        var itemToSave = {};
        for(var p in item){
            itemToSave[p] = this._serializeProperty(item[p])
        }
        return itemToSave;
    }
    _serializeProperty(item){
        if(!item) return {"NULL": null}
        switch(typeof(item)){
            case "string": return {"S": item}
            case "number": return {"N": item.toString()}
            case "boolean": return {"B": item}
            case "object":
                if(Array.isArray(item)){
                    return {"L": item.map(this._serialize)}
                }
                if(item instanceof Date){
                    return {"S": item.toISOString()}
                }
                return {"M": this._serialize(item)}
        }
    }
}


@inject(Repository, config)
export class CvRepository {
    constructor(repo, config){
        this.repo = repo;
        this.config = config;
    }
    saveProfile(profile){
        profile.userId = this.config.userId;
        return this.repo.saveItem(profile, "Profiles");
    }
    getProfile(){
        return this.repo.getItem("userId", this.config.userId, "Profiles")
    }
    addSkill(skill){
        if(!skill.skillName){
            throw new Error("Skill name required");
        }
        return this.repo.saveItem(skill, "Skills");
    }
    getSkills(){
        return this.repo.getAllItems("Skills");
    }
}