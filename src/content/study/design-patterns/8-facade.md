---
title: "퍼사드 패턴"
category: "디자인 패턴"
order: 8
---


퍼사드 패턴은 여러 서브 시스템을 사용해야 할 때, 사용하기 편한 인터페이스를 제공해주는 역할을 하는 디자인 패턴이다.

예를 들어, 집에서 영화를 보기 위해서는 TV, 오디오, 전등, 팝콘 기계, DVD플레이어 등 여러 인터페이스를 순차적으로 동작시켜야 한다.

또한 영화를 더 이상 안보기로 했다면 모든 과정을 거꾸로 진행해야 한다.

코드로 예를 들면 다음과 같다.

```java
tv.on();
audio.on();
lamp.off();
popper.on();
popper.off();
dvdPlayer.on();
```

여러 서브 시스템들을 사용하기 쉽게 하나의 인터페이스로 제공하는 것이 퍼사드 패턴이다.

```java
public void HomeTheaterFacade {
	Tv tv;
	Audio audio;
	Lamp lamp;
	PopcornPopper popper;
	DvdPlayer dvdPlayer;
	
	public void startWatchMovie() {
		this.tv.on();
		this.audio.on();
		this.lamp.off();
		this.popper.on();
		this.popper.off();
		this.dvdPlayer.on();
	}
}
```

이전 장에서 배운 어댑터 패턴과 비슷하다.

Adapter 패턴과 Facade 패턴의 차이점은 감싸는 클래스의 갯수 차이는 아니다. 

Adapter 패턴은 인터페이스를 변경해서 클라이언트에서 필요로 하는 인터페이스로 적용시키는 역할을 하고, Facade 패턴은 어떤 서브시스템에 대한 간단한 인터페이스를 제공하기 위한 용도로 사용된다.

퍼사드 패턴을 잘 활용하면 클라이언트와 서브 시스템이 복잡하게 얽히는 상황을 방지할 수 있게 된다.

이는 다음과 같은 객체 지향 원칙을 준수하는 데에도 도움이 된다.

> 최소 지식 원칙 - 어떤 객체든 그 객체와 상호작용 하는 클래스의 개수에 주의해야 한다.
> 

이 원칙을 잘 따르면 여러 클래스들이 복잡하게 얽혀있어서, 한 부분을 변경했을 때, 줄줄이 고쳐야 하는 상황을 방지할 수 있다.