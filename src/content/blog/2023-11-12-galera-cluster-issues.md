---
title: MariaDB Galera 클러스터 이슈 모음
date: 2023-11-12
tags: [database]
---


## Auto increment 사용 시 시퀀스가 노드 갯수만큼 오른다.

테이블 제약조건 중 특정 컬럼에 Auto increment 라는 옵션을 설정할 수 있다.

이 옵션은 Row가 삽입될 때 컬럼 Null로 입력되어도 자동으로 1씩 증가한 수치가 입력되는 옵션이다.

보통 기본 키로 숫자형 타입을 사용하고, DB로 채번을 할 때 사용하는 방법이다.

MariaDB Galera는 멀티 마스터 클러스터이기 때문에 여러 노드에서 쓰기 작업을 할 수 있다.

이 때 동시에 같은 테이블에 데이터를 삽입하면 Auto increment로 ID를 생성할 때 Deadlock이 발생하지 않을까 생각했었다.

하지만 Galera는 모든 노드에 각기 다른 초기 시퀀스를 지정하고 Auto increment를 할 때마다 노드 갯수만큼 숫자가 증가하도록 하여 이 문제를 해결했다.

예를 들어 3개의 노드는 다음과 같은 순서로 ID를 채번한다

| 노드1 | 노드2 | 노드3 |
| --- | --- | --- |
| 1 | 2 | 3 |
| 4 | 5 | 6 |
| 7 | 8 | 9 |

셋 중의 하나의 노드에만 쓰기 작업이 된다면 다른 노드에 동기화되어 사용된 id보다 큰 수로 자동 설정되게 된다.

[https://galeracluster.com/library/kb/auto-increment-multiples.html](https://galeracluster.com/library/kb/auto-increment-multiples.html)

## Deadlock 발생 가능성

Galera는 성능의 문제로 서로 다른 노드끼리 Lock을 공유하지 않는다.

모든 쓰기 작업에 Lock을 공유하여 성능을 떨어뜨리기 보단, 경합이 일어나지 않는다고 낙관하는 편이 낫다고 본것이다.

때문에 동시에 같은 Row에 대한 쓰기 작업이 있을 경우 Deadlock이 발생하게 되며 Rollback되게 된다.

이 문제를 해결하기 위해서는, Rollback이 일어날 경우 재시도 하는 로직을 작성하거나, 한 노드에서만 쓰기 작업을 하는 방법이 있을 수 있겠다.

[https://galeracluster.com/library/kb/deadlock-found.html](https://galeracluster.com/library/kb/deadlock-found.html)

[https://stackoverflow.com/questions/75413460/why-mariadb-galera-cluster-thrown-a-deadlock-instead-of-waiting](https://stackoverflow.com/questions/75413460/why-mariadb-galera-cluster-thrown-a-deadlock-instead-of-waiting)