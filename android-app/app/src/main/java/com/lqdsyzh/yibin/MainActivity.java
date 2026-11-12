package com.lqdsyzh.yibin;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseAdapter;
import android.widget.ImageView;
import android.widget.ListView;
import android.widget.TextView;

import java.util.ArrayList;
import java.util.List;

public class MainActivity extends Activity {

    private static final String BASE = "https://lqdsyzh.github.io/yibin/";

    private static class Entry {
        final String title;
        final String subtitle;
        final String path;
        final int badge;

        Entry(String title, String subtitle, String path, int badge) {
            this.title = title;
            this.subtitle = subtitle;
            this.path = path;
            this.badge = badge;
        }
    }

    private final List<Entry> entries = new ArrayList<>();

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        entries.add(new Entry("魅力宜宾", "首页 · 深色主题", "", 0));
        entries.add(new Entry("李权 · 宜宾", "第二个作品", "docs/liquan/", 1));
        entries.add(new Entry("李权 · 待办清单", "数据存在本机浏览器", "docs/liquan/todo/", 1));
        entries.add(new Entry("刘秀直招", "可玩原型 · Phase-2", "liuxiu-game/playable/", 2));

        ListView list = findViewById(R.id.list);
        list.setAdapter(new BaseAdapter() {
            @Override
            public int getCount() {
                return entries.size();
            }

            @Override
            public Entry getItem(int position) {
                return entries.get(position);
            }

            @Override
            public long getItemId(int position) {
                return position;
            }

            @Override
            public View getView(int position, View convertView, ViewGroup parent) {
                View v = convertView;
                if (v == null) {
                    v = LayoutInflater.from(MainActivity.this)
                            .inflate(R.layout.item_work, parent, false);
                }
                Entry e = getItem(position);
                ((TextView) v.findViewById(R.id.title)).setText(e.title);
                ((TextView) v.findViewById(R.id.subtitle)).setText(e.subtitle);
                ImageView icon = v.findViewById(R.id.icon);
                switch (e.badge) {
                    case 1:
                        icon.setImageResource(R.drawable.ic_doc);
                        break;
                    case 2:
                        icon.setImageResource(R.drawable.ic_game);
                        break;
                    default:
                        icon.setImageResource(R.drawable.ic_home);
                }
                return v;
            }
        });

        list.setOnItemClickListener((parent, view, position, id) -> {
            Entry e = entries.get(position);
            Intent i = new Intent(MainActivity.this, WebActivity.class);
            i.putExtra(WebActivity.EXTRA_TITLE, e.title);
            i.putExtra(WebActivity.EXTRA_URL, BASE + e.path);
            startActivity(i);
        });

        findViewById(R.id.siteLink).setOnClickListener(v -> {
            Intent i = new Intent(MainActivity.this, WebActivity.class);
            i.putExtra(WebActivity.EXTRA_TITLE, "魅力宜宾");
            i.putExtra(WebActivity.EXTRA_URL, BASE);
            startActivity(i);
        });
    }
}
