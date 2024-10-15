import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CoralGuideAssetsComponent } from './coral-guide-assets.component';

describe('CoralGuideAssetsComponent', () => {
  let component: CoralGuideAssetsComponent;
  let fixture: ComponentFixture<CoralGuideAssetsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoralGuideAssetsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CoralGuideAssetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
