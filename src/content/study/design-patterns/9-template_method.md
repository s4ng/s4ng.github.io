---
title: "템플릿 메서드 패턴"
category: "디자인 패턴"
order: 9
---


템플릿 메서드 패턴은 메서드 안에 단계별로 메서드를 정의한 후, 이 중 몇몇 메서드는 서브 클래스에서 구현할 수 있도록 하는 패턴이다.

메서드는 알고리즘의 골격을 정의하고, 실제 알고리즘은 서브 클래스가 구현하는 방식이다.

예를 들어보자면, 커피 클래스와 차(Tea) 클래스가 있다고 가정해보자.

커피 클래스

```java
public class Coffee {
	void prepareRecipe() {
		boilWater();
		brewCoffeeGrinds();
	}
	
	public void boilWater() {
		// boil water
	}
	
	public void brewCoffeeGrinds() {
		// brew Coffee Grinds
	}
}
```

차 클래스

```java
public class Tea {
	void prepareRecipe() {
		boilWater();
		brewTeaBag();
	}
	
	public void boilWater() {
		// boil water
	}
	
	public void brewTeaBag() {
		// brew tea bag	
	}
}
```

만약 두 클래스를 추상화한다면, 같은 행동을 하는 boilWater() 함수를 가지고 있는 수퍼 클래스를 정의한 뒤, 두 클래스가 해당 클래스를 상속하면 될 것이다.

하지만 prepareRecipe() 함수의 경우는 어떨까? 비슷한 일을 하는 메서드이지만, 내용(알고리즘)이 달라 수퍼 클래스에서 구현할 수 없을 것 같다.

이 때, prepareRecipe() 메서드를 골격으로 하는 템플릿 메서드 패턴을 적용시키면 해결이 가능해진다.

brewCoffeeGrinds()와 brewTeaBag() 메서드는 실제 역할은 다르지만, 대략적인 내용은 비슷하다. 따라서 brew() 추상 메서드로 추출하여 수퍼 클래스에 위치한다.

따라서 수퍼 클래스는 다음과 같아진다.

```java
// 상속한 클래스가 brew() 메서드를 구현할 수 있도록 추상 클래스로 선언
public abstract class CaffeineBeverage {
	// 알고리즘의 골격으로 정의해서 각 클래스는 세부 알고리즘만 구현할 수 있도록 함.
	final void prepareRecipe() {
		boilWater();
		brew();
	}
	
	// 두 클래스가 서로 brew() 알고리즘을 구현할 수 있도록 추상 메서드로 선언
	abstract void brew();
	
	void boilWater() {
		// 두 클래스에서 완전히 같은 기능을 하는 메서드는 여기에서 구현
	}
}
```

그리고 위 수퍼 클래스를 구현하게 되는 커피, 차 클래스는 다음과 같다.

```java
public class Coffee extends CaffeineBeverage {
	@Override
	public void brew() {
		// brew coffee grids
	}
}
```

```java
public class Tea extends CaffeineBeverage {
	@Override
	public void brew() {
		// brew tea bag
	}
}
```

커피와 차 클래스에서는 prepareRecipe() 메서드나 boilWater()같은 메서드는 구현할 필요가 없어졌다.

## 후크

템플릿 메서드 패턴에서 수퍼 클래스가 메서드를 오버라이드할 지 하지 말 지 선택하게 할 수 있는 기능이 후크이다.

예를 들어 수퍼 클래스에서 구현한 특정 클래스의 결과값에 의해 서브 클래스의 메서드의 실행 여부가 결정되도록 하면, 서브 클래스는 해당 클래스를 오버라이드 하여 자신의 메서드 실행 여부를 결정할 수 있다.

알고리즘의 단계적 실행 여부는 수퍼 클래스의 몫이지만, 그 권한을 서브 클래스에 넘겨주는 느낌이다.

예를 들어 위의 CaffeineBeverage 클래스가 다음과 같이 만들어질 수 있다.

```java
public abstract class CaffeineBeverage {
	final void prepareRecipe() {
		boilWater();
		if (wantBrew()) {
				brew();
		}
	}
	
	abstract void brew();
	
	void boilWater() {
		// 두 클래스에서 완전히 같은 기능을 하는 메서드는 여기에서 구현
	}
	
	// 서브 클래스는 이 메서드를 오버라이드 함으로서 prepareRecipe 내부의 실행 조건을 바꿀 수 있다.
	void boolean wantBrew() {
		return true;
	}
}
```

## 할리우드 원칙

할리우드 원칙은 다음과 같다.

> 제가 연락 할테니, 연락 하지 마세요.
> 

고수준 모듈이 저수준 모듈에 의존하고, 저수준 모듈이 고수준 모듈에 의존하고… 이런 식으로 의존성이 어지럽게 얽혀있는 것을 의존성 부패라고 한다.

고수준 모듈이 저수준 모듈에 의존하는 것은 좋지 않은 디자인 패턴이다.

위 템플릿 메서드에서, 고수준 모듈(CaffeineBeverage) 에서 저수준 모듈(Coffee, Tea) 의 알고리즘을 사용하는 것이 바로 할리우드 원칙이라고 할 수 있겠다.