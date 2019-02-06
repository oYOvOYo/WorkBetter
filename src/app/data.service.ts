import { Injectable } from '@angular/core';
// import { Headers, Http } from '@angular/http';
import { HttpClient } from '@angular/common/http';


import { Todo } from './todo';
import { Timer } from './timer';
import { UserData } from './config';
import { Alert } from './alert.service';
import { UserService } from './user.service';

@Injectable()
export class DataService {
  private gists_description = 'work-better config file';
  private config_filename = 'work-better';

  constructor(private http: HttpClient,
    private userService: UserService,
    private alert: Alert) {
  }

  saveToGists(config: UserData): Promise<void> {
    return this.getGistId()
      .then(id =>
        this.http.patch(this.userService.getGistsUrl() + '/' + id,
          this.configToGistFormat(config),
          { headers: this.userService.getHeaders() })
          .toPromise()
          .then(response => {
            this.alert.alert('primary', 'Great!', 'Save Success');
            console.log('Save', response.toString);
          }));
  }

  updateTodo(title: string, todo: Todo): Promise<void> {
    return this.getRowFile()
      .then(config => {
        config.todos.forEach(each_todo => {
          if (each_todo.title === title) {
            each_todo.title = todo.title;
            each_todo.detail = todo.detail;
            each_todo.isFinished = todo.isFinished;
          }
        });
        return config;
      })
      .then(config => this.saveToGists(config));
  }

  addTodo(todo: Todo): Promise<void> {
    return this.getRowFile()
      .then(config => {
        if (config.todos === undefined) {
          config.todos = [todo];
        } else {
          config.todos.push(todo);
        }
        return config;
      })
      .then(config => this.saveToGists(config));
  }

  addTimer(timer: Timer): Promise<void> {
    return this.getRowFile()
      .then(config => {
        if (config.timers === undefined) {
          config.timers = [timer];
        } else {
          config.timers.push(timer);
        }
        return config;
      })
      .then(config => this.saveToGists(config));
  }

  getTodos(): Promise<Todo[]> {
    return this.getRowFile()
      .then(config => config.todos as Todo[])
      .catch(this.handleError);
  }

  getTimers(): Promise<Timer[]> {
    return this.getRowFile()
      .then(config => config.timers as Timer[])
      .catch(this.handleError);
  }

  getRowFile(): Promise<UserData> {
    return this.getGistId()
      .then(id =>
        this.http.get(this.userService.getGistsUrl() + '/' + id,
          { headers: this.userService.getHeaders() })
          .toPromise()
          .then(response => response[this.config_filename].raw_url)
      )
      .then(raw_url =>
        this.http.get(raw_url)
          .toPromise()
          .then(response => response)
      )
      .catch(this.handleError);
  }

  getGistId(): Promise<String> {
    return this.http.get(this.userService.getUserGistsUrl(),
      { headers: this.userService.getHeaders() })
      .toPromise().then(response => response)
      //   .filter(
      //   each_gists => each_gists.description === this.gists_description
      // ))
      .then(response =>
        !(response[0] === undefined) ? response[0].id : this.createNewGist()
      )
      .catch(this.handleError);
  }

  createNewGist(): Promise<String> {
    console.log('create new config file');

    return this.http.post(this.userService.getGistsUrl(),
      this.initialConfigToGistFormat(),
      { headers: this.userService.getHeaders() })
      .toPromise()
      .then(response => response['id']);
  }

  configToGistFormat(config): string {
    const file = {
      'description': this.gists_description,
      files: {
        'work-better': {
          'content': JSON.stringify(config, null, ' ')
        }
      }
    };
    return JSON.stringify(file);
  }

  initialConfigToGistFormat(): string {
    return `{
      "description": "` + this.gists_description + `",
      "public": false,
      "files": {
        "` + this.config_filename + `": {
          "content": "` + JSON.stringify(new UserData) + `"
        }
      }
    }`;
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}
