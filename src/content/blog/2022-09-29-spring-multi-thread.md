---
title: Spring에서 멀티스레드 사용하기
date: 2022-09-29
tags: [spring]
---


## Thread pool 설정

보통 ThreadPoolExecutor를 사용해서 멀티스레드 프로그래밍을 구현하지만, 스프링에서는 기본적으로 ThreadPoolTaskExecutor를 많이 사용한다.

ThreadPoolTaskExecutor를 bean으로 등록하여 DI 받아 사용할 수 있다.

```java
// 설정 클래스
@RequiredArgsConstructor
@Configuration
@EnableAsync
public class ThreadPoolConfiguration {

	private final PamProperties properties;

	@Bean
	@Primary
	public ThreadPoolTaskExecutor threadPoolTaskExecutor() {

		ThreadPoolTaskExecutor taskExecutor = new ThreadPoolTaskExecutor();
		taskExecutor.setCorePoolSize( properties.getPool().getCoreSize() );
		taskExecutor.setMaxPoolSize( properties.getPool().getMaxSize() );
		taskExecutor.setQueueCapacity( properties.getPool().getQueueCapacity() );
		taskExecutor.setThreadNamePrefix( "My-thread-pool-" );
		taskExecutor.initialize();
		return taskExecutor;
	}
}
```

```java
// 실제 사용할 때 (생성자 주입)
private final ThreadPoolTaskExecutor executor; 
```

## 다건 조회에 멀티스레드 적용하기

다건 조회할 때 멀티 스레드를 적용하기 위해서는 모든 작업이 다 완료된 것을 확인해야 한다.

1개만 조회할 때는, Callable로 구현한 Worker를 이용해서 Future.get() 으로 결과값을 기다렸다 확인할 수 있다.

하지만 다건 조회일 경우, 어떤 작업이 먼저 끝날 지 모르기 때문에 단순히 Future.get()으로 결과값을 기다리게 되면 성능상의 손해를 볼 수 있다.

### CompletionService 이용하기

CompletionService는 Blocking 큐에 **완료된** 작업을 담아 돌려준다.

그렇기 때문에, 스레드 풀로 실행된 작업의 개수만 알면, 그 개수만큼 완료된 작업의 결과값을 열어서 최종 결과물로 합쳐 반환할 수 있다.

```java
// 총 10개의 작업을 돌린다 가정.
// executor은 위에서 DI로 받아온 ThreadPoolTaskExecutor임.
ExecutorCompletionService< Integer > completionService = new ExecutorCompletionService<>( executor );

for(int i = 0; i < 10; i++) {
	completionService.submit( new Worker() );
}

for(int i = 0; i < 10; i++) {
	try {
				// Future에 래핑된 결과값을 반환받고, 열어봄.
				// 이미 완료된 작업만 Queue에 들어있음.
				Future< Integer > future = completionService.take();
				Integer futureResponse = future.get();
				
				// 그냥 작업
				resultMap.get( futureResponse.getKey() ).update( futureResponse );

			} catch ( InterruptedException | ExecutionException e ) {
				log.error( e.toString() );
			}
}
```