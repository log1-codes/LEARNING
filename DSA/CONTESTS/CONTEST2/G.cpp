#include<bits/stdc++.h>
using namespace std;
int main()
{
    int N ;
    cin>>N ;
    long long a[1000000];
    for(int i =0;i<N; i++)
    {
        cin>>a[i];
    }

    int left = N/2-1;
    int right = N/2;

    cout<<a[left]<< " "<<a[right]<< " ";
    left--;
    right++;

    while(left >=0  && right<N)
    {
        cout<<a[left]<<" "<<a[right]<<" ";
        left-- ;
        right++;
    }
    return 0;

}