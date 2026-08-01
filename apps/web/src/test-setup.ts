import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';

beforeEach(async () => {
  TestBed.configureTestingModule({
    providers: [provideZonelessChangeDetection()],
  });
  await TestBed.compileComponents();
});
