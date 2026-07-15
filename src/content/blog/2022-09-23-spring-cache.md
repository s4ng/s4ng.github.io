---
title: Spring boot에서 Cache 적용하기
date: 2022-09-23
tags: [spring]
---


## Annotation

1. 가장 첫 번째로 프로젝트 내에 `@Configuration` 으로 빈이 등록된 클래스에 `@EnableCaching` 어노테이션을 붙여줘야 한다.
2. Spring boot에서는 `@Cacheable` 어노테이션을 이용하면 손쉽게 캐시를 적용할 수 있게 된다. 
3. 특정 메서드를 실행 시킨 후 캐시를 제거하기 위해서는 `@CacheEvict` 를 사용한다.
4. 여러개의 메서드를 한꺼번에 실행시키기 위해서는

```java
@Caching( evict = {
		@CacheEvict( value = "IAM:UserList", allEntries = true ),
		@CacheEvict( value = "IAM:UserListAttributes", allEntries = true )
} )
```

요런식으로 사용한다.

## 조건

스프링에서 캐시는 객체를 직렬화 하여 Byte 배열로 만들고 저장한 후에, 다시 꺼내와서 역직렬화 하여 객체로 만들어 반환하는 것을 말한다.

여기서 직렬화, 역직렬화 등을 수행하기 위해서는 `ObjectInputStream`, `ObjectOutputStream` 등을 사용할 수 있는데, 이 때 해당 클래스에 Serializable 인터페이스를 객체에 상속하여 구현해야 한다.

> `Serializable` 인터페이스는 특별하게 하는 일은 없고, 단지 직렬화 역직렬화에 쓰일 수 있다는 객체라는 것을 표현하기 위한 마커 용도로만 사용된다. 마치 어노테이션과 비슷한 역할.
> 

따라서 캐싱에 사용되는 객체는 모두 `Serializable` 을 구현하여야 하며, 모든 필드 객체들도 마찬가지다.

## Redis에 캐시 저장하기

스프링에서는 `@EnableCaching` 으로 캐시를 설정하고, Redis를 사용할 수 있도록 설정만 되어있다면 자동으로 Redis에 대한 캐시 기능을 활성화 시킨다.

`RedisConnectionFactory`, `RedisTemplate` 이 빈으로 등록되어 있다면, 자동으로 해당 Redis로 캐시가 저장된다.

추가적으로 커스텀 설정을 하고 싶다면 `@Configuration` 클래스 내에 `RedisCacheManager`를 반환하는 메서드를 빈으로 등록하여 설정할 수 있다.

### 에러 발생

로컬에서 Redis에 캐시를 저장한 후, 배포 환경에서 해당 캐시를 불러와 역직렬화를 하는데 에러가 발생했다.

바로 객체의 `SerialVersionUid`가 달라서 역직렬화에 실패했다는 것.

기본적으로 Serializable를 구현한 객체는 각각의 SerialVersionUid를 가지고 있는데, 이는 클래스의 변경사항을 체크하여 버전을 관리하기 위해 생성된 Uid이다.

그런데 나는 분명히 클래스에 변경사항을 만든적이 없는데 왜 이런 문제가 발생했을까

SerialVersionUid는 변경사항이 같더라도, 컴파일러가 다르면 각각 다르게 생성될 수 있다고 한다.

내가 로컬에서 실행시킬 때에는 IntelliJ의 IDEA 환경에서 실행시켰고, 빌드는 gradle 환경에서 빌드하여 같은 클래스임에도 다른 SerialVersionUId가 생성된 것이다.

이럴때에는 해당 클래스에 SerialVersionUid를 직접 명시한 후 `@Serial`어노테이션을 붙이면 어떤 환경에서도 이 SerialVersionUid를 보고 버전을 확인하기 때문에 오류가 발생하지 않는다.

```java
@Serial
private static final long serialVersionUID = -654_142_847_198_237_126L;
```

## 또 다른 에러 발생

SerialVersionUid를 직접 명시했음에도 또 똑같은 에러가 발생했다.

이번에는 gradle에서 다른 프로젝트를 include 했을 때 이름이 같은 jar 파일 안에 있는 클래스 내용이 달라서 생긴 문제였다.

다시 말하면 현재 프로젝트에서 사용중인 A.jar 파일과 gradle 설정에서 include 한 다른 프로젝트에서 사용중인 A.jar 파일이 이름은 똑같은데 하나는 SerialVersionUid가 있고 하나는 없어서 발생한 문제였다.

gradle이 빌드를 하다가 이름이 같은 Jar 파일이 같은 내용일 것이라고 착각하여 아무렇게나 합쳐서 빌드를 했다고 추측해 볼 수 있었다.

해당 문제는 단순히 다른 프로젝트에도 A.jar를 업데이트 해주어 해결하였고, 추후에 Nexus 레포지토리를 이용해서 jar 파일을 관리해 해결하였다.

끝