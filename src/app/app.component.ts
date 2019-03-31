import { Component } from '@angular/core';
import { Observable, interval, of, fromEvent } from 'rxjs';
import { take, map, mergeMap, switchMap, filter } from 'rxjs/operators'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'rxjs';
  observable$:any;
  numbers$:any;
  fiveNumbers$:any;
  letters$:any;

  ngOnInit() {
    fromEvent(document, 'click').subscribe(x => console.log(x));

    this.observable$ = Observable.create((observer) => {
      observer.next(1);
      observer.next(2);
      observer.next(3);
      observer.complete();
    });
    this.observable$.subscribe(
      value => console.log(value),
      err => {},
      () => console.log('this is the end')
    )

    this.numbers$ = interval(1000);
    //.pipe is the ES6 way of incorporating operators
    //take - only take the first x
    //map - transform function
    //filter - only include values under function y
    this.fiveNumbers$ = this.numbers$.pipe(take(5)).pipe(map(x => x * 10)).pipe(filter(x => x>=20));
    this.fiveNumbers$.subscribe(x => {console.log(x)});

    this.letters$ = of("a","b","c","d","e");
    this.letters$.pipe(switchMap(x => this.numbers$.pipe(take(5)).pipe(map(i => i+x)))).subscribe(x => console.log(x));
  
  
  }

  ngOnDestroy() {
    this.observable$.unsubsribe();
    this.fiveNumbers$.unsubscribe();
    this.letters$.unsubscribe();
  }
}
