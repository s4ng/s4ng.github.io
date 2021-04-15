---
layout: post
title:  "NestJS 입문"
subtitle: "#NestJS #Typescript #Node.js"
date: 2021-04-15
type: "information"
blog: true
text: true
author: "s4ng"
post-header: false
header-img: ""
order: 8
---

## 개요

NestJS 프레임워크 실습 프로젝트 by [Nomad Coders](https://nomadcoders.co/nestjs-fundamentals/lobby)

### [Repository](https://github.com/s4ng/hi-nest)

## 1. Project Setup

가장 먼저 해야할 것은 nestjs cli를 설치하는 것이다.

주의해야 할 점은 `yarn`으로 설치하게 되면 자잘한 오류가 생긴다고 하여 `npm`으로 설치하는 것을 추천한다.
```bash
$ npm i -g @nestjs/cli
```
설치가 되었다면 터미널에 `nest` 명령어를 입력해보자.

nest cli로 사용할 수 있는 명령어들의 리스트가 나온다면 설치가 잘 된 것으로 볼 수 있다.

프로젝트를 새로 생성하기 위해서는 터미널에 `nest new 프로젝트이름` 을 입력한다.

프로젝트를 실행하기 위해서는 다음과 같은 명령어를 사용할 수 있다.

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## 2. Controller, Service

Node.js로 개발되는 많은 프로젝트는 express를 사용하여 개발되곤 한다.

express는 Node.js의 많은 기능을 효율적으로 사용할 수 있도록 추상화되어있고, 또 굉장히 자유롭다.

하지만 프로젝트가 점점 커지면서 별다른 규칙없이 마구잡이로 개발을 하다 보면 유지보수가 굉장히 어려워질 수 있는 단점이 있다.

NestJS는 이러한 단점을 보완하고자 프레임워크 수준에서 여러가지 규칙과 구조를 제공한다.

<br>

여기서 살펴볼 Controller와 Service는 마치 Spring의 그것과 굉장히 비슷하다.

내가 이전에 작업했었던 express 프로젝트에서는, 정말 별다른 규칙 없이 하나의 엔드포인트에 하나의 함수를 정해두고 모든 작업을 그 안에서 모두 해결했었다.

그렇다 보니, 문제점이 생겼을 때 그것을 수정하기 위해서는 해당 함수를 전부 훑어봐야 했었다.

Controller와 Service는 HTTP 요청이 들어올 함수와, 비즈니스 로직이 들어갈 함수를 나누어서 개발하는 것인데, 이렇게 되면 함수가 각각 하나의 역할만 맡아서 할 수 있게 되고, 추후에 문제가 생긴 곳을 바로 찾아갈 수 있다.

NestJS에서 Controller와 Service를 만들기 위해서는 
```bash
$ nest g co 도메인이름

$ nest g s 도메인이름
```
위와 같은 명령어를 사용할 수 있다.

> 여기서 `g`는 `generate`로 바꿔서 사용할 수 있고, `co`와 `s`도 모두 `controller`와 `service`의 alias이다

도메인 이름을 movies로 Controller와 Service를 생성하였다면

```
movies
├── movies.controller.ts
└── movies.service.ts
```
이와 같은 형태로 파일이 자동으로 생성되게 된다.

이렇게 도메인별로 디렉토리를 구분하는 것을 DDD(Domain Driven Design)라고 한다.

<br>

아주 기본적인 컨트롤러의 모습은 다음과 같다
```ts
//movies.controller.ts
@Controller('movies')
export class MoviesController {

  constructor(private readonly moviesService: MoviesService) {}

  @Get()
  getAll():Movie[] {
    return this.moviesService.getAll()
  }
}
```

클래스를 하나 생성하고, 그 위에 `@Controller` 데코레이터를 사용하여 해당 클래스가 컨트롤러임을 선언한다.

데코레이터의 매개변수로 넣는 문자열은 해당 컨트롤러로 접근할 수 있는 엔드포인트를 뜻한다.

Controller에서 Service클래스를 사용하기 위해서는 의존성을 주입(Dependency Injection)받아야 한다.

많은 기본 Nest 클래스는 공급자(Provider)로 사용되고 있다. 공급자의 주요 아이디어는 의존성을 주입할 수 있다는 것이다.

공급자 클래스를 만들기 위해서는 `@Injectable()` 데코레이터를 달아야 한다. Nest Cli에서 생성된 클래스들은 모두 자동으로 이러한 설정이 적용되고 있다.

의존성을 주입받는 방법은 `constructor`를 이용하여 선언하는 방법이 있다.

```ts
@Controller('some')
export class SomeController {

  constructor(private readonly someService: SomeService) {}
}
```

여기서 `private readonly`는 본 클래스의 객체 내에서만 사용되고, 읽기 전용으로 선언하겠다는 것을 의미한다.

<br>

Service의 함수들은 보통 Controller와 1:1 매칭이 되어있는 경우가 빈번하기 때문에, 보통 이름을 같게 설정하는 것이 일반적인 것 같다.

```ts
//movies.service.ts
@Injectable()
export class MoviesService {
  private movies: Movie[] = [];

  getAll(): Movie[] {
    return this.movies;
  }
}
```

위에서 말한 것처럼 `@Injectable()`을 달아 다른 클래스 내에서 주입받을 수 있는 `Provider`로 만들겠다고 선언하였다.

원래는 실제 데이터베이스를 연동하는 Repository 클래스를 따로 생성한 후 의존성을 주입받아야 하지만, 간단하게 배열에 저장하는 형식으로 하였다.

## 3. Rest API

컨트롤러 클래스 내부에서는 HTTP 요청을 받을 수 있는 함수를 선언할 수 있는데, 각 함수는 HTTP 메서드에 맞는 데코레이터를 사용하여 간단하게 선언할 수 있다.

해당 예시에서는 `@Get`데코레이터를 사용하여 Get 메서드를 사용하는 엔드포인트를 선언하였다.

또한 `@Post`, `@Put`, `@Patch`, `@Delete` 등을 사용할 수 있다.

<br>

컨트롤러에서 쿼리 스트링이나, 파라미터를 받는 방법은 다음과 같다.

```ts
@Controller('movies')
export class MoviesController {

  constructor(private readonly moviesService: MoviesService) {}

  @Get(':id')
  getById(@Param('id') movieId: string): Movie {
    return this.moviesService.getById()
  }
}
```
여기서 `@Get(':id')`안의 `id`와, 아래의 `@Param('id')` 안의 `id`는 같은 것을 지칭하는 변수이다. 그래서 꼭 같은 이름으로 지정해 주어야 한다.

반면 뒤의 movieId는 해당 함수 안에서 사용할 변수이므로 이름이 달라도 괜찮다.

쿼리를 받아오기 위해서는 `@Query('year') searchYear`와 같은 방식으로 받아올 수 있다. 해당 쿼리는 `?year=2021` 를 받아서 searchYear에 2021을 저장한다.

또한 모든 파라미터나 쿼리는 URL로 받아오는 값인 만큼, 문자열로 받아오게 된다. 따라서 함수 내에 사용될 자료형으로 변환해주는 과정이 필수로 필요하다.

하지만 Nest는 Controller 수준에서 데이터 형을 지정해서 받아올 수 있도록 하는 기능이 포함되어 있다.

```ts
// main.ts
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      // 여기!
      transform: true,
    })
  )
  await app.listen(3000);
}
bootstrap();
```

`transform`옵션을 `true`로 준 후, 해당 컨트롤러에서 받아오는 데이터형을 지정해주면 된다.

```ts
  @Get(':id')
  getById(@Param('id') movieId: number): Movie {
    //                            ^ 여기!
    return this.moviesService.getById()
  }
```

<br>

Nest에서 예외처리를 하기 위해서는 다음과 같이 할 수 있다.

```ts
@Injectable()
export class MoviesService {
  private movies: Movie[] = [];

  getOne(id:number):Movie {
    const movie = this.movies.find(movie => movie.id === +id);
    if(!movie) {
      // 여기!
      throw new NotFoundException(`Movie ${id} is not exist`)
    }
    return movie;
  }
}
```

`NotFoundException` Exception을 사용하면 자동으로 `404` 상태 코드와 해당 메세지가 포함된 결과 값이 `json` 형식으로 반환되게 된다.

Nest에서는 상태 코드 이름에 따라 여러가지 Exception을 제공하고 있다.

## 4. Unit Testing

유닛 테스트는 각 모듈에 있는 함수들이 잘 작동하는지 테스트 하는 방법을 의미한다.

Nest는 프로젝트 생성 시 자동으로 Jest 및 테스트 도구들을 설치하고, 또 각 모듈을 생성할 때에도 자동으로 테스트 코드 파일을 생성하게 된다.

위에서 `nest g co test`와 같이 모듈을 생성하였다면,

```
test
├── test.controller.ts
└── test.controller.spec.ts
```
과 같이 `spec.ts`파일이 자동으로 생성되었을 것이다.

프로젝트에서 test를 실행시키면 Jest는 자동으로 프로젝트 내의 모든 spec 파일을 찾은 뒤 테스트를 진행하게 된다.

Nest Cli에서 테스트를 실행하는 방법은 다음과 같다.

```bash
# 테스트 1회 진행
$ npm run test

# 테스트 watch 모드. ctrl + c 로 종료하기 전 까지 파일 변경을 감지하고 계속 테스트를 진행한다.
$ npm run test:watch

# 테스트 커버리지 확인. 얼마나 많은 파일, 함수에 테스트가 진행되었는지 확인할 수 있다.
$ npm run test:cov
```

<br>

Jest를 이용한 유닛 테스트의 간단한 예시는 다음과 같다

```ts
// movies.service.spec.ts
describe('MoviesService', () => {
  let service: MoviesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MoviesService],
    }).compile();

    service = module.get<MoviesService>(MoviesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
}
```

`describe`로 여러개의 테스트를 주제 별로 묶고, `it`함수에서 테스트 코드를 작성할 수 있다.

`describe`와 `it`모두 첫 번째 매개 변수로는 테스트의 간략한 설명을 문자열로 넣고, 두 번째 매개 변수에 익명 함수를 이용하여 테스트 코드를 작성하게 된다.

`expect().toBe~()` 와 같은 아주 직관적인 문법을 이용하여 테스트 코드를 작성할 수 있다. 

또한 `beforeEach`는 해당 describe 안의 모든 테스트 이전에 한 번씩 실행시키겠다는 의미의 함수이다. 여기서는 MovieService를 테스트 모듈에 주입시키게 하였다.

## 5. E2E Testing

`E2E`란 `End to End`의 줄임말로서, 사용자가 실제로 테스트를 진행하는 것 처럼 테스트를 진행한다.

예를 들면, 우리의 프로젝트는 Rest API 서버이므로, 루트 API에 접근했을 때부터, 모든 Rest 요청을 직접 보내서 알맞은 응답이나 상태 코드가 나오는지 테스트 하는 방법이다.

간단한 예시는 다음과 같다.

```ts
//app.e2e-spec.ts
describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      })
    )
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Welcom to Movie API');
  });
}
```

해당 테스트 코드에서는 `beforeAll`을 이용하여 모든 테스트 전에 컨트롤러 설정을 하였고, 루트 `/` 엔드포인트에 접속할 때, 알맞은 응답 값과 상태 코드가 나오는지 확인하는 코드를 작성하였다.

`it` 함수 안의 `.get()`을 HTTP 메서드에 맞는 함수로 바꾸어 다른 모든 함수들도 테스트 할 수 있다.