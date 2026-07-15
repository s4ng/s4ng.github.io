---
title: Objects.requireNonNull 이란
date: 2022-07-11
tags: [java]
---


Objects 객체에 있는 간편한 null 검사 메서드라고 할 수 있다.

```java
public static <T> T requireNonNull(T obj) {
    if (obj == null)
        throw new NullPointerException();
    return obj;
}

```

내부 구조는 이렇게 간단하다.

### 왜 쓰는가

- NPE를 잡기 위해 사용
- null이 될 가능성이 아예 없다는 것을 코드 상에서 강조하기 위해
- JVM이 null 포인터를 찾아서 NPE를 발생시키는 것보다 명시적으로 직접 던지는것이 성능상의 이점이 있음.

### Optional과의 차이점

Optional은 null이 될 가능성이 조금이라도 있을 경우 안전하게 처리하기 위함이라면,

`requiredNonNull`은 null이 되면 안되는 객체에 사용한다.