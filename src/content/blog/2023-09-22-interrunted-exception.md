---
title: InterruptedException 발생 시 해결방법
date: 2023-09-22
tags: [java]
---


### Interrupt란?

다른 스레드를 멈추기 위해서 사용하는 방법.

강제로 멈추기 보단 해당 스레드에게 능동적으로 적당한 때에 멈추게 하도록 신호를 보내는 행위를 말함.

### InterruptException이란?

스레드에 Interrupt를 요청하면 보통 2가지 패턴이 발생함.

- 해당 스레드가 Blocking 상태라면 - InterruptedException이 발생함
- 일반적인 상태일 경우 - Interrupt state가 설정됨.

해당 스레드는 현재 InterruptedException이 발생했는지, 또는 Interrupt state가 설정되어 있는지를 판단하고 Interrupt를 수행하면 된다.

### InterruptedException 처리 방법

```java
try {
    Thread.sleep(1000);
} catch (InterruptedException e) {
    Thread.currentThread().interrupt();
		throw new CustomException();
}
```

InterruptedException이 발생할 경우, Interrupt state가 초기화 되기 때문에 상위 호출 스택이나 Thread pool에서 이를 알 수 있는 방법이 사라진다.

따라서 발생한 InterruptedException을 최상위 스택으로 던지면 블로킹 상태에서도 Interrupt 요청을 받아들일 수 있다.

또한 catch 절에서 `Thread.currentThread().interrupt()`를 사용하여 다시 Interrupt state를 설정하면 상위 호출 스택에 Interrupt 된 사실을 알릴 수 있어 더 유연한 대처가 가능하다.

이 때, 선택적으로 별도의 Runtime exception을 발생시켜줘도 좋다.