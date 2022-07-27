import { Injectable } from '@nestjs/common';

export type User = {
  id: number;
  name: string;
  mobile: string;
  email: string;
  username: string;
  password: string;
  refreshToken: string;
};

@Injectable()
export class UsersService {
  private readonly users: User[] = [
    {
      id: 1,
      name: 'Leanne Graham',
      mobile: '92873549872',
      email: 'leanne@gmail.com',
      username: 'Bret',
      password: 'thisIsNotAPassword',
      refreshToken: '',
    },
    {
      id: 2,
      name: 'Ervin Howell',
      mobile: '928735493456',
      email: 'ervin@gmail.com',
      username: 'Antonette',
      password: 'thisIsNotAPassword',
      refreshToken: '',
    },
    {
      id: 3,
      name: 'Clementine Bauch',
      mobile: '928723452645',
      email: 'clementine@gmail.com',
      username: 'Samantha',
      password: 'thisIsNotAPassword',
      refreshToken: '',
    },
  ];

  public create(user: User) {
    this.users.push(user);
    console.log('created users', this.users);
  }

  public findOne(username: string): User | undefined {
    return this.users.find((user) => user.username === username);
  }

  public findOneById(id: number): User | undefined {
    return this.users.find((user) => user.id === id);
  }

  public updateUserRefreshTokenHash(user: User, refreshToken: string) {
    const index = this.users.findIndex((u) => u.id === user.id);
    this.users[index].refreshToken = refreshToken;
    console.log('updated user refresh token', this.users[index].refreshToken);
  }
}
