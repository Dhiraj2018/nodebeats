import {Component, ElementRef, OnInit, Output, Input, EventEmitter, ViewChild} from '@angular/core';
import {NewsService} from "./news.service";
import {NewsImageModel, NewsImageResponse} from "./news.model";
import {ActivatedRoute,Router} from '@angular/router';
import {Location} from '@angular/common';

@Component({
  selector: 'news-image-list',
  templateUrl: './news-image-list.html'
})

export class NewsImageListComponent implements OnInit {

  objListResponse: NewsImageResponse;
  error: any;
  newsId:string;
  // @Input() newsId: string;
  @ViewChild('prevCoverImage') prevCoverImage: ElementRef;
  // @Output() showNewsListEvent: EventEmitter<any> = new EventEmitter();
  showImageForm: boolean = false;
  imageId: string;
  /* Pagination */
  // perPage:number = 10;
  // currentPage:number = 1;
  // totalPage:number = 1;
  // first:number = 0;
  /* End Pagination */


  constructor(private location:Location,private router:Router,private activatedRoute:ActivatedRoute,private _objService: NewsService, private eleRef: ElementRef) {
    activatedRoute.params.subscribe(param=>this.newsId=param['id']);
  }

  ngOnInit() {
    this.getNewsImageList();
  }

  getNewsImageList() {
    this._objService.getNewsImageList(this.newsId)
      .subscribe(objRes =>this.bindList(objRes),
        error => this.errorMessage(error));
  }

  errorMessage(objResponse: any) {
    swal("Alert !", objResponse.message, "info");

  }

  bindList(objRes: NewsImageResponse) {
    this.objListResponse = objRes;
    if (objRes.image.length > 0) {
      this.sortTable();
    }
  }

  sortTable() {
    setTimeout(()=> {
      jQuery('.tablesorter').tablesorter({
        headers: {
          2: {sorter: false},
          3: {sorter: false},
          4: {sorter: false}
        }
      });
    }, 50);
  }

  edit(newsImageId: string) {
    this.router.navigate(['/news/image/'+ this.newsId +'/editor',newsImageId]);
    // this.showImageForm = true;
    // this.imageId = id;
  }

  addImage() {
    this.router.navigate(['/news/image/'+ this.newsId + '/editor']);
    // this.showImageForm = true;
    // this.imageId = null;
  }

  delete(id: string) {
    swal({
        title: "Are you sure?",
        text: "You will not be able to recover this Image !",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Yes, delete it!",
        closeOnConfirm: false
      },
      ()=> {

        this._objService.deleteNewsImage(this.newsId, id)
          .subscribe(res=> {
              this.getNewsImageList();
              swal("Deleted!", res.message, "success");
            },
            error=> {
              swal("Alert!", error.message, "info");

            });
      });

  }

  back() {
    this.location.back();
    // this.showNewsListEvent.emit(true); // cancelled true
  }

  showImageList(arg) {
    console.log('hello');
    if (!arg) // is not Canceled
      this.getNewsImageList();

    // // this.showImageForm = false;
    this.sortTable();
  }

  changeCoverImage(args) {
    let newsImageId = args.target.value;
    swal({
        title: "Are you sure?",
        text: " you sure to change cover image ?",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Yes, change it!",
        closeOnConfirm: false
      },
      (isConfirm)=> {
        if (isConfirm) {
          let prevCoverImageId = this.prevCoverImage ? this.prevCoverImage.nativeElement.value : "";
          let objNewsImage: NewsImageModel = new NewsImageModel();
          objNewsImage._id = newsImageId;
          objNewsImage.coverImage = true;
          this._objService.updateNewsCoverImage(this.newsId, prevCoverImageId, objNewsImage)
            .subscribe(res=> {
                this.getNewsImageList();
                swal("Changed!", res.message, "success");
              },
              error=> {
                swal("Alert!", error.message, "info");

              })
        } else {
          let prevCoverImageId = "";
          if (this.prevCoverImage.nativeElement.value)
            jQuery('input[name=rdbCoverImage][value=' + this.prevCoverImage.nativeElement.value + ']').prop('checked', true);

        }
      });
  }

  // vppChanged(event:Event) {
  //     this.perPage = Number((<HTMLSelectElement>event.srcElement).value);
  //     this.getNewsImageList();
  // }
  //
  // pageChanged(arg) {
  //     if (arg != this.nextPage) {
  //         this.nextPage = arg;
  //         this.currentPage = arg;
  //         this.getNewsImageList();
  //     }
  // }


}

