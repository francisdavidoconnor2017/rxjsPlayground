import { Component } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable, Subject, interval, of, fromEvent } from 'rxjs';
import { take, map, switchMap, filter, debounceTime, distinctUntilChanged } from 'rxjs/operators'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'rxjs';
  observable$: Observable<number>;
  numbers$: Observable<number>;
  fiveNumbers$: Observable<number>;
  letters$: Observable<any>;
  results$: Observable<any>;  
  x: number;
  i: string;
  searchSubject$: Subject<string>;
  constructor(private http: HttpClient) {}
  ngOnInit() {

    this.observable$ = Observable.create((observer) => {
      observer.next(1);
      observer.next(2);
      observer.next(3);
      observer.complete();
    });
    this.observable$.subscribe(
      value => console.log(value),
      err => { },
      () => console.log('this is the end')
    )

    this.numbers$ = interval(1000);
    //.pipe is the ES6 way of incorporating operators
    //take - only take the first x
    //map - transform function
    //filter - only include values under function y
    this.fiveNumbers$ = this.numbers$.pipe(take(5)).pipe(map(x => x)).pipe(filter(x => x >= 20));
    this.fiveNumbers$.subscribe(x => { console.log(x) });

    this.letters$ = of("a", "b", "c", "d", "e");
    this.letters$.pipe(switchMap(x => this.numbers$.pipe(take(5)).pipe(map(i => i + x)))).subscribe(x => console.log(x));

    this.searchSubject$ = new Subject<string>();
    this.searchSubject$.pipe(debounceTime(200)).subscribe(z => console.log("Debounced", z));
    this.results$ = this.searchSubject$.pipe(debounceTime(200)).pipe(distinctUntilChanged()).pipe(switchMap(searchString => this.queryApi(searchString)));
  }

  inputChange($event) {
    console.log('Input changed', $event);
    this.searchSubject$.next($event)
  }

  queryApi(searchString){
    console.log('queryAPI', searchString);
    return this.http.get(`https://www.reddit.com/r/aww/search.json?q=${searchString}`).pipe(map(result => result['data']['children']));
  }

  ngOnDestroy() {
    //this.observable$.unsubscribe();
    //this.fiveNumbers$.unsubscribe();
    //this.letters$.unsubscribe();
  }
}
