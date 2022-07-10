import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute, convertToParamMap, Router } from '@angular/router';
import moment from 'moment';
import { Moment } from 'moment';
import { distinctUntilChanged, interval, map, Observable } from 'rxjs';

@Component({
  selector: 'app-first',
  templateUrl: './first.component.html',
  styleUrls: ['./first.component.css']
})
export class FirstComponent implements OnInit {
  message: Moment;
  sentAt: Date;
  timeFromNow: Observable<Moment>;
  pageLoaded: Moment;

  form: FormGroup;
  loading = false;
  submitted = false;

  constructor(private activatedRoute: ActivatedRoute, 
              private router: Router, 
              private formBuilder: FormBuilder) {
    this.message = moment(new Date());
    this.sentAt = new Date();

    this.pageLoaded = moment(new Date());

    this.timeFromNow = interval(1000).pipe(
      map(() => {
        return this.pageLoaded; // Get current date
        //return moment(this.pageLoaded).fromNow(true);
      }
      ),
    );
    this.timeFromNow.subscribe((value) => {
      this.message = value;
    }
    );

    this.form = this.formBuilder.group({
      'username': ['', Validators.required],
      'password': ['', [Validators.required , Validators.minLength(7), this.cannotContainSpace]]
    });
  }
  // convenience getter for easy access to form fields
  get f() { return this.form.controls; }

   cannotContainSpace(control: AbstractControl) : ValidationErrors | null {
    if((control.value as string).indexOf(' ') >= 0){
        return {cannotContainSpace: true}
    }

    return null;
}
  onSubmit(name: any) {
    this.submitted = true;
    let erros = this.f['password'].errors;
    
    let passwordEnc64 = btoa(this.f['password'].value);
    console.log(name.password, name.username);
  }
  ngOnInit(): void {
    
    this.activatedRoute.queryParams.subscribe((params) => {
      let paramMap = convertToParamMap(params);
      for (let index = 0; index < paramMap.keys.length; index++) {
        let key = paramMap.keys[index];
        const values = paramMap.getAll(key);
        const value = paramMap.get(key); // get single value
        console.log(key + " has " + values.length + " value(s)");
        for (let index = 0; index < values.length; index++) {
          const element = values[index];
          console.log(key + ":" + values[index]);
        }
      }
    });
  }
}
