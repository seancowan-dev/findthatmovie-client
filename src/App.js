import React, { Component } from 'react';
// import { SiteProvider } from './main/Context';
import { observable, computed } from 'mobx';
import { Provider } from "mobx-react";
import uuid from "uuid";
import ErrorBound from './comps/ErrorBound';
import DomainStore from './DomainStore'
import Header from './header/Header';
import Sidebar from './sidebar/Sidebar';
import Main from './main/Main';
import './App.css';

const store = {
  valueStore: DomainStore,
}

class App extends Component {
  @observable

  handleErrors(response) { // prepares error message for HTTP request errors
      if (response.ok === true) {
          return response.json();
      } else {
          throw new Error("Code " + response.status + " Message: " + response.statusText)
      }
  }

  hex(string) {
    let source = unescape(encodeURIComponent(string));
    let hex = '';
      for (var i = 0; i < source.length; i++) {
          hex += source.charCodeAt(i).toString(16)
      };
      return hex;
  };

  async getFolders() {
    return await fetch(`http://localhost:8000/api/folders`, {
      method: 'GET',
      headers: {
        'content-type': 'application/json'
      },
    })
    .then(response => this.handleErrors(response))
    .then(resJSON => { return resJSON })
    .catch(e => alert(e));
  }

  async getNotes() {
    return await fetch(`http://localhost:8000/api/notes`, {
      method: 'GET',
      headers: {
        'content-type': 'application/json'
      },
    })
    .then(response => this.handleErrors(response))
    .then(resJSON => { return resJSON })
    .catch(e => alert(e));
  }

  async deleteNote(id) {
    return await fetch(`http://localhost:8000/api/notes/${id}`, {
      method: 'DELETE',
      headers: {
        'content-type': 'application/json'
      },
    })
    .then(response => { 
      if (response.ok === true) {
        this.getNotes().then(res => {
          this.setState({
            notes: res,
          });
        });

    } else {
        throw new Error("Code " + response.status + " Message: " + response.statusText)
    }
    })
    .catch(e => alert(e));

  }

  async addNote(event) {
    event.preventDefault();
    let workingArr = Array.from(event.target.parentNode.childNodes);
    let date = new Date(Date.now());
    let note = {
      id: uuid.v4(),
      name: "",
      modified: date.toISOString(),
      folderid: "",
      content: ""
    };
    workingArr.filter(child => {
      if(child.name === "add-note-content") {
        note.content = child.value;
      }
      if (child.name === "add-note-title") {
        note.name = child.value;
      }
      if (child.name === "select-note-folder") {
        note.folderid = child.selectedOptions[0].id;
      }
      return null
    });
    await fetch(`http://localhost:8000/api/notes/`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify(note)
    })
    .then(response => {
      if (response.ok === true) {
        this.promises().then(res => {
          this.setState({
            notes: res[1],
          });
        });
        return response.json();
    } else {
        throw new Error("Code " + response.status + " Message: " + response.statusText)
    }
    }).catch(e => alert(e));    
  }

  async addFolder(event) {
    event.preventDefault();
    let workingArr = Array.from(event.target.parentNode.childNodes);
    let folder = {
      id: "",
      name: "",
    };
    workingArr.filter(child => {
      if(child.name === "add-folder-title") {
        folder.name = child.value;
        folder.id = uuid.v4();
      }
      return null
    });

    await fetch(`http://localhost:8000/api/folders/`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify(folder)
    })
    .then(response => {
      if (response.ok === true) {
        this.promises().then(res => {
          this.setState({
            folders: res[0],
          });
        });
        return response.json();
    } else {
        throw new Error("Code " + response.status + " Message: " + response.statusText)
    }
    }).catch(e => alert(e));
  }

  async deleteFolder(id) {
    await fetch(`http://localhost:8000/api/folders/${id}`, {
      method: `DELETE`,
      headers: {
        'content-type': 'application/json'
      },

    })
    .then(response => { 
      if (response.ok === true) {
        this.promises().then(res => {
          this.setState({
            folders: res[0],
          });
        });

    } else {
        throw new Error("Code " + response.status + " Message: " + response.statusText)
    }
    })
    .catch(e => alert(e));
  }

  async updateFolder(id, updates) {
    await fetch(`http://localhost:8000/api/folders/${id}`, {
      method: `PATCH`,
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify(updates),
    })
    .then(response => {
      if (response.ok === true) {
        this.promises().then(res => {
          this.setState({
            folders: res[0],
          });
        });
        
    } else {
        throw new Error("Code " + response.status + " Message: " + response.statusText)
    }
    })
    .catch(e => alert(e));
  }

  async updateNote(id, updates) {
    await fetch(`http://localhost:8000/api/notes/${id}`, {
      method: `PATCH`,
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify(updates),
    })
    .then(response => {
      if (response.ok === true) {
        this.promises().then(res => {
          this.setState({
            notes: res[1],
          });
        });
        
    } else {
        throw new Error("Code " + response.status + " Message: " + response.statusText)
    }
    })
    .catch(e => alert(e));
  }

  promises() {
    return Promise.all([this.getFolders(), this.getNotes()]);
  }

  render() {
    return(
    <div className="primary-container">
      
      <Header 
        pageTitle="Welcome to Noteful"
      />
      <Provider {...store}>
        <ErrorBound>
            <Sidebar />
        </ErrorBound>
        <ErrorBound>
            <Main/>
        </ErrorBound>
      </Provider>
    
    </div>
    );
  };
};

export default App;
