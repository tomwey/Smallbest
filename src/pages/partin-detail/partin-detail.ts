import { Component,ViewChild,ElementRef } from '@angular/core';
import { NavController, NavParams, ModalController, App } from 'ionic-angular';
import { PartinsService } from '../../providers/partins-service';
import { ToolService } from '../../providers/tool-service';
import { UserService } from '../../providers/user-service';
import { BadgesService } from '../../providers/badges-service';
import { DomSanitizer } from '@angular/platform-browser';
import { Platform } from 'ionic-angular';
import { NativeService } from '../../providers/native-service';

@Component({
  selector: 'page-partin-detail',
  templateUrl: 'partin-detail.html',
})
export class PartinDetailPage {

  partin: any = null;

  answer: string = '';
  position: any = null;
  earns: any = [];
  
  pageNo: number = 1;
  pageSize: number = 20;
  totalPage: number = 1;
  hasMore: boolean = false;

  hasLoaded: boolean = false;
  
  disableCommit: boolean = false;
  commitButtonText: string = '';

  // 提交按钮点击跳转去分享
  commitToShare: boolean = false;

  oldPartin: any = null;

  // @ViewChild(Content) content: Content;
  @ViewChild('partinDetail') partinDetail: ElementRef;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private partins: PartinsService,
    private toolService: ToolService,
    private modalCtrl: ModalController,
    private users: UserService,
    // private platform: Platform,
    private badges: BadgesService,
    private app: App,
    private sanitizer: DomSanitizer,
    private platform: Platform,
    private naService: NativeService,
  ) {
    this.partin = this.navParams.data;
    this.oldPartin = this.navParams.data;

    this.platform.ready().then(() => {
      this.bindLinkEvents();
    });
  }

  private bindLinkEvents() {
    this.partinDetail.nativeElement.onclick = (e: Event) => {
      e = e ||  window.event;
      var element = (e.target || e.srcElement) as HTMLElement;
      if (element.tagName == 'A' || element.tagName == 'a') {
        this.naService.openUrlInApp(element.getAttribute('href'));
        // window.open(element.getAttribute('href'), "_blank", "location=yes,allowInlineMediaPlayback=yes,toolbarposition=top,closebuttoncaption=关闭");
        // someFunction(element.href);
        return false; // prevent default action and stop event propagation
      }
    };
  }

  ionViewDidLoad() {
    // if (this.platform.is('mobileweb') && this.platform.is('ios')) {
    //   this.content.enableJsScroll();
    // }
  }

  public getHtmlWithBypassedSecurity(code: string) {
    if (!code) return '';
    return this.sanitizer.bypassSecurityTrustHtml(code);
  }

  ionViewDidEnter() {
    if (!this.hasLoaded) {
      this.hasLoaded = true;
      this.loadEvent();
    }
  }

  openOwnerInfo(): void {

     this.app.getRootNavs()[0].push('HBOwnerTimelinePage', { owner: this.partin.owner, 
       hbId: this.partin.id });
  }

  doShare(): void {
    this.users.token().then(token => {
      window.location.href = `http://b.hb.small-best.com/wx/share/partin?id=${this.partin.id}&f=${token}`;
    });
  }

  gotoReport(): void {
    let modal = this.modalCtrl.create('ReportPage', { eventId: this.partin.id });
    modal.present();
  }

  loadEvent(needAddViewCount: boolean = true): void {
    this.toolService.showLoading('拼命加载中...');
    this.partins.getEvent(this.partin.id, needAddViewCount)
      .then(data => {
        setTimeout(() => {
          // console.log(data);
          this.partin = data;
          if (needAddViewCount) {
            this.partin.view_count += 1;
          }
          this.toolService.hideLoading();

          this.disableCommit = !!this.partin.disable_text
          this.commitButtonText = this.partin.disable_text ? 
            this.partin.disable_text : this.partin.rule.action;
        }, 0);
      })
      .catch(error => {
        this.toolService.hideLoading();
        setTimeout(() => {
          this.toolService.showToast(error);
        }, 200);
      });
  }

  commit(): void {
    if (this.partin.rule_type === 'quiz' && this.answer === '') {
      this.toolService.showToast('必须选择一个答案');
      return;
    } 

    if (this.partin.rule_type === 'sign' && this.answer === '') {
      this.toolService.showToast('口令不能为空');
      return;
    }

    // 准备参数
    let payload;
    if (this.partin.rule_type === 'quiz') {
      // let answers = this.partin.rule.answers;
      payload = { hb: this.partin, answer: this.answer, location:  null };
    }  else if ( this.partin.rule_type === 'sign' ) { 
      payload = { hb: this.partin, answer: this.answer, location:  null };
    } else if ( this.partin.rule_type === 'checkin' ) {
      payload = { hb: this.partin, location:  null };
    }

    this.commitData(payload);
  }

  commitData(payload): void {
    
    this.toolService.showLoading('提交中...');
    this.partins.commit(payload)
      .then(data => {
        
        this.oldPartin.taked = true;

        if (data.card) {
          this.badges.incrementCurrentBadge();
        }

        this.gotoSuccessPage({ code: 0, message: 'ok', result: data.result, partin: data.partin });
        this.toolService.hideLoading();
      })
      .catch(error => {
        // console.log(error);
        let msg = error.message || error;
        if (msg.indexOf('500') !== -1) {
          msg = 'Oops, 服务器出错了, 我们正在处理...';
        }
        this.toolService.hideLoading();
        this.gotoSuccessPage({ code: -1001, message: msg, result: null, partin: this.partin });
      });
  }

  gotoSuccessPage(data): void {
    this.app.getRootNavs()[0].push('PartinResultPage', data);
  }

}
