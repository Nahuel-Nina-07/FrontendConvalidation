import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AcadeicListStudentsService } from '../../services/homologation/acadeic-list-students.service';
import { Student } from '../../services/homologation/estudent';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-subject-aprovates',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './subject-aprovates.component.html',
  styleUrl: './subject-aprovates.component.scss'
})
export class SubjectAprovatesComponent implements OnInit {
  studentData: Student | null = null;

  constructor(private route: ActivatedRoute, private academicListStudentsService: AcadeicListStudentsService) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const studentId = params['id'];
      if (studentId) {
        this.academicListStudentsService.getById(studentId).subscribe(data => {
          this.studentData = data;
        });
      }
    });
  }
}