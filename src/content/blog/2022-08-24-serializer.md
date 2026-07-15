---
title: Serializer 사용할 때 오류 해결 (serialVersionUID)
date: 2022-08-24
tags: [java]
---


```json
Internal Error : Cannot deserialize; nested exception is org.springframework.core.serializer.support.SerializationFailedException: Failed to deserialize payload. Is the byte array a result of corresponding serialization for DefaultDeserializer?; nested exception is java.io.InvalidClassException: com.netand.avocado.commons.model.RangedList; local class incompatible: stream classdesc serialVersionUID = 483724120854811000, local class serialVersionUID = 5721141485719607363"
```

`Serializer`를 상속받은 클래스는 `serialVersionUID`를 이용해서 클래스의 단일성을 보존하는데, (정확히는 버전 관리)

만약 직접 명시하지 않았다면 클래스 정보가 바뀔 때마다 컴파일러가 `serialVersionUID`를 새로 계산해서 만들어낸다.

이 때 `redis`에 `Serializer`로 직렬화한 `json` 데이터가 저장되고 나중에 같은 클래스로 역 직렬화를 실행하려고 할 때 이 `serialVersionUID`가 다르면 에러가 난다.

(저장하는 쪽과 불러오는 쪽의 컴파일러가 다르기 때문에 각 `serialVersionUID`가 달라 지게 됨.)

이 때 클래스 안에 직접 `serialVersioUID`를 명시해주면 오류가 나지 않는다.

```java
@Serial
private static final long serialVersionUID = -654_142_847_198_237_128L;
```