namespace LocoClient {

  export interface ICurrentUser {
    Id: string;
    Username: string;
    FirstName: string;
    LastName: string;
    IsOnline: boolean;
    X: number;
    Y: number;
  }

  export class CurrentUser implements ICurrentUser {
    Id: string;
    Username: string;
    FirstName: string;
    LastName: string;
    IsOnline: boolean;
    X: number;
    Y: number;
  }


  export class CurrentUserStore {
    currentUser: ICurrentUser;
    visible: boolean;

    constructor(currentUser: ICurrentUser) {
      this.currentUser = currentUser;
    }

    getUser() : ICurrentUser {
      return this.currentUser;
    }

    showMe(show: boolean) {
      this.visible = show;
    }

  }
}
