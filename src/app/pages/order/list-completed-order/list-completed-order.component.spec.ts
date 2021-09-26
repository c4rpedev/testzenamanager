import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListCompletedOrderComponent } from './list-completed-order.component';

describe('ListCompletedOrderComponent', () => {
  let component: ListCompletedOrderComponent;
  let fixture: ComponentFixture<ListCompletedOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListCompletedOrderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListCompletedOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
