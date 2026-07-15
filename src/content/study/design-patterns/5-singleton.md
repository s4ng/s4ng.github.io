---
title: "싱글턴 패턴"
category: "디자인 패턴"
order: 5
---


싱글턴 패턴은 객체가 단 하나만 필요할 때 사용하는 패턴이다.

스레드 풀, 캐시, 로그 저장용 객체 등 과 같은 상황에서 사용할 수 있다.

싱글턴 패턴을 구현하는 방법은 다음과 같다.

```java
public class Singleton {

	private static Singleton uniqueInstance;

	// Private 생성자. 이 클래스 안에서만 호출할 수 있다.
	private Singleton() {}
	
	// 객체를 얻는 메서드. Singletom.getInstance() 와 같이 사용한다.
	public static Singleton getInstance() {
		// 객체를 담고 있는 변수가 Null일 때 객체를 생성한다.
		if (uniqueInstance == null) {
			uniqueInstance = new Singleton();
		}
		// 저장된 객체 반환
		return uniqueInstance;
	}
}
```

이 코드는 객체를 실제로 사용할 때 생성하기 때문에, Lazy instantiation 이라고 부른다.

하지만 위 코드는 스레드 안전하지 않다.

여러 스레드가 동시에 getInstance()를 호출하게 되면, `new Singleton()` 이 여러번 실행되어 객체가 여러개 생길 수 있다.

이 부분은 synchronized 키워드를 추가하면 해결이 가능하다.

```java
public class Singleton {

	private static Singleton uniqueInstance;

	private Singleton() {}
	
	// synchronized를 사용하여 메서드에 진입할 때 스레드 동기화
	public static synchronized Singleton getInstance() {
		if (uniqueInstance == null) {
			uniqueInstance = new Singleton();
		}
		return uniqueInstance;
	}
}
```

이 코드도 완벽하지는 않다.

getInstance()를 호출할 때마다 synchronized 키워드로 인해 lock이 걸리기 때문에 오버헤드가 심하다는 단점이 있다.

스레드 동기화 오버헤드를 없애기 위해서는 다음과 같은 방법을 사용해 볼 수 있다.

- 인스턴스를 느리게 생성하지 말고, 처음에 생성해둔다.
    - if 절을 없애고, 클래스가 로드될 때, 변수에 바로 객체를 생성해서 저장하는 방법을 사용하면 synchronized를 사용하지 않아도 된다.
- DCL(Double Checking Lock)을 사용하여 getInstance()에서 동기화가 되는 부분을 줄인다.
    - `if (uniqueInstance == null)` 이 false 라면 객체가 이미 생성되었다는 뜻이니 바로 넘어가고, true라면 객체가 없다는 의미이므로 내부에 따로 synchronized 블럭을 두어 다시한 번 객체가 존재하는 지 확인한다.
    
    ```java
    public class Singleton {
    
    	private static Singleton uniqueInstance;
    
    	private Singleton() {}
    	
    	public static synchronized Singleton getInstance() {
    		if (uniqueInstance == null) {
    			// 여기서 스레드 동기화
    			synchronized (Singleton.class) {
    				// 객체가 존재하는지 Double-Checking
    				if (uniqueInstance == null) {
    						uniqueInstance = new Singleton();
    				}
    			}
    		}
    		return uniqueInstance;
    	}
    }
    ```
    

추가로 이펙티브 자바에서는 변수가 하나인 열거형(Enum)을 사용하는 것도 싱글턴을 구현하는 좋은 방법이라고 소개하고 있다.